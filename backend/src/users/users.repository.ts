import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/users.entity';
import { Repository } from 'typeorm';
import {
  RegisterUserDto,
  RegisterUserFairDto,
  SendEmailDto,
  UpdatePasswordDto,
} from '@users/users.dto';
import * as bcrypt from 'bcrypt';
import { Fair } from '@fairs/entities/fairs.entity';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as QRCode from 'qrcode';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { UserStatusGeneral } from '@users/users.enum';
import { isSameDay } from 'date-fns';
import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
import axios from 'axios';

dotenvConfig({ path: '.env' });

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Fair) private readonly fairRepository: Repository<Fair>,
    @InjectRepository(BuyerCapacity)
    private readonly buyerCapacityRepository: Repository<BuyerCapacity>,
    @InjectRepository(UserFairRegistration)
    private readonly userFairRegistrationRepository: Repository<UserFairRegistration>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async subscribe(email: string): Promise<{ message: string }> {
    if (!this.validateEmail(email)) {
      throw new BadRequestException(
        'Por favor, introduce un correo electrónico válido.',
      );
    }

    const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
    const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const mailchimpBaseUrl = process.env.MAILCHIMP_BASE_URL;

    try {
      const url = `${mailchimpBaseUrl}/lists/${mailchimpAudienceId}/members`;

      const response = await axios.post(
        url,
        {
          email_address: email,
          status: 'subscribed',
        },
        {
          headers: {
            Authorization: `Bearer ${mailchimpApiKey}`,
          },
        },
      );

      if (response.status === 200 || response.status === 204) {
        return { message: 'Suscripción exitosa al newsletter.' };
      } else {
        throw new InternalServerErrorException(
          'Error al suscribir al newsletter.',
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new BadRequestException(
          'Este correo ya está suscrito al newsletter.',
        );
      }
      throw new InternalServerErrorException(
        'Error al procesar la suscripción.',
      );
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
      relations: [
        'seller',
        'seller.registrations',
        'seller.registrations.fair',
        'seller.registrations.categoryFair.category',
        'registrations',
        'registrations.fair',
        'seller.products',
        'seller.products.fairCategory',
        'seller.products.fairCategory.fair',
      ],
    });
    return users;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: [
        'seller',
        'seller.registrations',
        'seller.registrations.fair',
        'seller.registrations.categoryFair.category',
        'registrations',
        'registrations.fair',
        'seller.products',
        'seller.products.fairCategory',
        'seller.products.fairCategory.fair',
      ],
    });
    if (!user) throw new NotFoundException('El usuario no existe');
    return user;
  }

  async findByDni(dni: string): Promise<User> {
    return await this.userRepository.findOneBy({ dni: dni });
  }

  async getUserByEmailAndDni(): Promise<{
    userInfo: User[];
  }> {
    const userInfo = await this.userRepository.find({
      select: ['email', 'dni'],
    });
    return { userInfo };
  }

  async registerUserFair(
    fairId: string,
    userId: string,
    registerUser: RegisterUserFairDto,
  ) {
    try {
      const { selectedHour, selectedDay } = registerUser;

      const fair = await this.fairRepository.findOne({
        where: { id: fairId },
        relations: ['fairDays', 'fairDays.buyerCapacities'],
      });
      if (!fair) throw new NotFoundException('Feria no encontrada');

      if (fair.isActive === false)
        throw new BadRequestException('Feria cerrada');

      const user = await this.getUserById(userId);
      if (!user) throw new NotFoundException('Usuario no encontrado');

      if (user.statusGeneral === UserStatusGeneral.BLOCKED)
        throw new BadRequestException('Usuario bloqueado');

      const fairDay = fair.fairDays.find((day) =>
        isSameDay(day.day, selectedDay),
      );
      if (!fairDay)
        throw new BadRequestException(
          'No existe un día de feria para la fecha seleccionada',
        );

      const buyerCapacity = fairDay.buyerCapacities.find(
        (buyerCap) => buyerCap.hour === selectedHour,
      );
      if (!buyerCapacity)
        throw new BadRequestException(
          'No existen cupos disponibles en esta hora',
        );

      if (buyerCapacity.capacity <= 0)
        throw new BadRequestException('No hay cupos disponibles en esta hora');

      const existingRegistration =
        await this.userFairRegistrationRepository.findOne({
          where: {
            user: { id: userId },
            fair: { id: fairId },
            registrationDay: selectedDay,
            registrationHour: selectedHour,
          },
        });

      if (existingRegistration) {
        throw new BadRequestException(
          'El usuario ya está registrado en esta feria para el día y horario seleccionado',
        );
      }

      buyerCapacity.capacity -= 1;
      await this.buyerCapacityRepository.save(buyerCapacity);

      const userRegistration = new UserFairRegistration();
      userRegistration.registrationDate = new Date();
      userRegistration.entryFee = fair.entryPriceBuyer;
      userRegistration.registrationDay = selectedDay;
      userRegistration.registrationHour = selectedHour;
      userRegistration.user = user;
      userRegistration.fair = fair;

      await this.userFairRegistrationRepository.save(userRegistration);

      user.registrations.push(userRegistration);
      await this.userRepository.save(user);

      user.statusGeneral = UserStatusGeneral.ACTIVE;
      await this.userRepository.save(user);

      const token = this.jwtService.sign(
        { email: user.email },
        { secret: process.env.JWT_SECRET },
      );

      await this.sendEmailInscriptionFair(user.email, token, fair);

      return {
        status: 'success',
        message: 'Inscripción realizada exitosamente',
        data: {
          userId,
          fairId,
          selectedHour,
          selectedDay,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async sendEmailInscriptionFair(email: string, token: string, fair: Fair): Promise<void> {
    const url = `${process.env.FRONTEND_URL}/fair/${token}`;
    const user = await this.findByEmail(email);
    const name = user.name;
    const DNI = user.dni;
    const fairName = fair.name;
    const fairPrice = fair.entryPriceBuyer;
  
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'L',
      scale: 1,
      width: 150,
    });
  
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    const qrCodeBuffer = Buffer.from(base64Data, 'base64');
  
    try {
      await this.mailService.sendMail({
        to: email,
        subject: 'Confirmación de inscripción a feria',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de inscripción</title>
            <style>
              :root {
                --primary-default: #79bec1;
                --primary-light: #acdee0;
                --primary-lighter: #def5f6;
                --primary-dark: #4b979b;
                --primary-darker: #2f8083;
                --secondary-default: #ffe09f;
                --secondary-light: #ffecc3;
                --secondary-lighter: #fff7e6;
                --secondary-dark: #ffd47b;
                --secondary-darker: #d9ab4d;
              }
  
              body {
                font-family: Arial, sans-serif;
                background-color: var(--primary-lighter);
                margin: 0;
                padding: 0;
              }
  
              .container {
                background-color: #ffffff;
                margin: 20px auto;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
              }
  
              h1 {
                color: var(--primary-darker);
                text-align: center;
              }
  
              p {
                color: var(--primary-dark);
                line-height: 1.6;
              }
  
              .data-list {
                list-style-type: none;
                padding: 0;
                margin: 0;
              }
  
              .data-list li {
                background-color: var(--secondary-lighter);
                margin: 5px 0;
                padding: 10px;
                border-radius: 5px;
              }
  
              .qr-container {
                text-align: center;
                margin-top: 20px;
              }
  
              .footer {
                text-align: center;
                margin-top: 20px;
                color: var(--primary-light);
                font-size: 12px;
              }
  
              .container {
                border: 2px solid var(--secondary-default);
              }
            </style>
          </head>
  
          <body>
            <div class="container">
              <h1>Confirmación de inscripción</h1>
              <h2>Hola {{name}},</h2>
              <p>Te has inscrito exitosamente a la feria "<strong>{{fairName}}</strong>". ¡Gracias por confiar en nosotros!</p>
              <p>Puedes mostrar este correo electrónico en la entrada o ingresar con el código QR.</p>
              <p>Tus datos:</p>
              <ul class="data-list">
                <li>Nombre: {{name}}</li>
                <li>DNI: {{DNI}}</li>
                <li>Precio de entrada: ${{fairPrice}}</li>
              </ul>
              <div class="qr-container">
                <img src="cid:qrCode" alt="Código QR" />
                <p>Presenta este código QR al ingresar a la feria:</p>
              </div>
              <div class="footer">
                <p>Si no solicitaste esta inscripción, puedes ignorar este correo.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        context: {
          name,
          DNI,
          fairName,
          fairPrice,
        },
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeBuffer,
            cid: 'qrCode',  
          },
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al enviar el correo de confirmación de inscripción');
    }
  
    return;
  }
  

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async updateUser(id: string, user: Partial<RegisterUserDto>): Promise<void> {
    const userFound = await this.getUserById(id);
    if (!userFound) throw new NotFoundException('El usuario no existe');

    if (userFound.statusGeneral === UserStatusGeneral.BLOCKED) {
      throw new BadRequestException('Usuario bloqueado');
    }

    Object.assign(userFound, user);
    await this.userRepository.save(userFound);
  }

  async resetPassword(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async createUserAuth0(newUser: Partial<User>) {
    await this.userRepository.save(newUser);
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async registerUser(newUser: Partial<RegisterUserDto>): Promise<User> {
    return await this.userRepository.save(newUser);
  }

  async updatePassword(id: string, data: UpdatePasswordDto): Promise<string> {
    try {
      const user = await this.getUserById(id);
      if (user.statusGeneral === UserStatusGeneral.BLOCKED) {
        throw new BadRequestException('Usuario bloqueado');
      }
      const passwordValid = await bcrypt.compare(
        data.current_password,
        user.password,
      );
      if (!passwordValid)
        throw new BadRequestException('La  contraseña actual es incorrecta');
      const newPassIsDiferent = await bcrypt.compare(
        user.password,
        data.newPassword,
      );
      if (newPassIsDiferent)
        throw new BadRequestException(
          'La nueva contraseña no puede ser la misma que la anterior',
        );
      if (data.newPassword === data.confirmNewPassword) {
        user.password = await bcrypt.hash(data.newPassword, 12);
        await this.userRepository.save(user);
        return 'contraseña actualizada';
      } else {
        throw new BadRequestException('Las contraseñas no coinciden');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async blockUser(id: string) {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('El usuario no existe');
    user.statusGeneral = UserStatusGeneral.BLOCKED;
    await this.saveUser(user);
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Cuenta bloqueada',
      html: `<html>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol'; background-color: #f4f4f4; margin: 0; padding: 0;
      -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } table {
      border-spacing: 0; } td { padding: 0; } img { border: 0; display: block;
      line-height: 100%; outline: none; text-decoration: none; } a {
      text-decoration: none; color: #333333; } .es-content-body {
      background-color: #ffffff; } .es-text-2036 { font-size: 26px; line-height:
      150% !important; text-align: center; padding: 10px 0; } .es-text-3299 {
      font-size: 18px; line-height: 200% !important; text-align: center;
      padding: 25px 40px; } .es-p10t { padding-top: 10px; } .es-p5b {
      padding-bottom: 5px; } .es-p40r { padding-right: 40px; } .es-p40l {
      padding-left: 40px; } .es-p25t { padding-top: 25px; } .es-p25b {
      padding-bottom: 25px; } .es-p10b { padding-bottom: 10px; }
      .esd-block-social { font-size: 0; text-align: center; } .es-social {
      display: inline-block; padding: 0; } .es-social td { padding: 0 40px; }
    </style>
  </head>
  <body>
    <table
      class='es-content'
      align='center'
      cellpadding='0'
      cellspacing='0'
      width='100%'
    >
      <tr>
        <td
          class='esd-stripe'
          align='center'
          background='https://ehserys.stripocdn.email/content/guids/CABINET_5c258a4c32f0353efed35594869ddf77f5d9197eca7f50e5ffd2d04a758e69ea/images/captura_de_pantalla_20240627_191221.png'
          style='background-image:url(https://ehserys.stripocdn.email/content/guids/CABINET_5c258a4c32f0353efed35594869ddf77f5d9197eca7f50e5ffd2d04a758e69ea/images/captura_de_pantalla_20240627_191221.png);background-repeat:repeat;background-position:center top'
        >
          <table
            bgcolor='#ffffff'
            class='es-content-body'
            align='center'
            cellpadding='0'
            cellspacing='0'
            width='500'
          >
            <tr>
              <td
                class='esd-structure es-p10t es-p5r es-p5l'
                align='left'
                bgcolor='#fff2cc'
                style='background-color:#fcfcfc;background-repeat:no-repeat;background-position:center top;background-size:auto contain'
              >
                <table
                  cellpadding='0'
                  cellspacing='0'
                  align='right'
                  class='es-right'
                >
                  <tr>
                    <td
                      width='490'
                      class='esd-container-frame'
                      align='center'
                      valign='top'
                    >
                      <table cellpadding='0' cellspacing='0' width='100%'>
                        <tr>
                          <td
                            align='center'
                            class='esd-block-text es-p10b es-m-txt-c es-text-2036'
                          >
                            <p
                              style='font-size:26px;line-height:150% !important;font-family:-apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,Roboto,Helvetica,Arial,sans-serif,&#39;Apple Color Emoji&#39;,&#39;Segoe UI Emoji&#39;,&#39;Segoe UI Symbol&#39;'
                              align='center'
                            >TU CUENTA HA SIDO BLOQUEADA</p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            align='center'
                            class='esd-block-text es-p40r es-p40l es-m-p0r es-m-p0l es-text-3299 es-p25t es-p25b'
                          >
                            <p
                              style='font-size:18px;line-height:200% !important'
                              align='center'
                            >Hola ${user.name},</p>
                            <p
                              style='font-size:18px;line-height:200% !important'
                              align='center'
                            >Tu cuenta ha sido bloqueada por el administrador,
                              no podras utilizar la plataforma</p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            align='center'
                            class='esd-block-text es-p10t es-p5b'
                          >
                            <p>Si tienes alguna duda o crees que esto es un
                              error, por favor contacta con el soporte.</p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            align='center'
                            class='esd-block-text es-p5t es-p5b es-p40r es-p40l es-m-p0r es-m-p0l'
                          >
                            <p>Gracias por tu comprensión.</p>
                            <p><strong>
                                EL PLAC FERIAS - COMPRÁ, VENDÉ, RECICLÁ, RENOVÁ.
                              </strong></p>
                            <p><strong>Ingresa a nuestra tienda y seguínos en
                                redes!</strong></p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            align='center'
                            class='esd-block-social es-p15t es-p15b'
                            style='font-size:0'
                          >
                            <table
                              cellpadding='0'
                              cellspacing='0'
                              class='es-table-not-adapt es-social'
                            >
                              <tr>
                                <td
                                  align='center'
                                  valign='top'
                                  class='es-p40r es-m-p0r'
                                ><a
                                    target='_blank'
                                    href='https://www.facebook.com/elplacarddemibebot'
                                  ><img
                                      title='Facebook'
                                      src='https://ehserys.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png'
                                      alt='Fb'
                                      width='32'
                                    /></a></td>
                                <td
                                  align='center'
                                  valign='top'
                                  class='es-p40r es-m-p0r'
                                ><a
                                    target='_blank'
                                    href='https://elplacarddemibebot.mitiendanube.com/'
                                  ><img
                                      title='X.com'
                                      src='https://ehserys.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png'
                                      alt='X'
                                      width='32'
                                    /></a></td>
                                <td align='center' valign='top'><a
                                    target='_blank'
                                    href='https://www.instagram.com/el_placard_de_mi_bebot'
                                  ><img
                                      title='Instagram'
                                      src='https://ehserys.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png'
                                      alt='Inst'
                                      width='32'
                                    /></a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
    });

    const invalidToken = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1s' },
    );

    return { message: 'usuario bloqueado', invalidToken: invalidToken };
  }

  async unblockUser(id: string) {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('El usuario no existe');

    user.statusGeneral = UserStatusGeneral.INACTIVE;
    await this.saveUser(user);

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Cuenta desbloqueada',
      html: `
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
              'Segoe UI Symbol'; background-color: #f4f4f4; margin: 0; padding: 0;
              -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } 
              table { border-spacing: 0; } 
              td { padding: 0; } 
              img { border: 0; display: block; line-height: 100%; outline: none; text-decoration: none; } 
              a { text-decoration: none; color: #333333; } 
              .es-content-body { background-color: #ffffff; } 
              .es-text-2036 { font-size: 26px; line-height: 150% !important; text-align: center; padding: 10px 0; } 
              .es-text-3299 { font-size: 18px; line-height: 200% !important; text-align: center; padding: 25px 40px; } 
              .es-p10t { padding-top: 10px; } 
              .es-p5b { padding-bottom: 5px; } 
              .es-p40r { padding-right: 40px; } 
              .es-p40l { padding-left: 40px; } 
              .es-p25t { padding-top: 25px; } 
              .es-p25b { padding-bottom: 25px; } 
              .es-p10b { padding-bottom: 10px; } 
              .esd-block-social { font-size: 0; text-align: center; } 
              .es-social { display: inline-block; padding: 0; } 
              .es-social td { padding: 0 40px; }
            </style>
          </head>
          <body>
            <table class="es-content" align="center" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td class="esd-stripe" align="center" background="https://ehserys.stripocdn.email/content/guids/CABINET_5c258a4c32f0353efed35594869ddf77f5d9197eca7f50e5ffd2d04a758e69ea/images/captura_de_pantalla_20240627_191221.png" 
                  style="background-image:url(https://ehserys.stripocdn.email/content/guids/CABINET_5c258a4c32f0353efed35594869ddf77f5d9197eca7f50e5ffd2d04a758e69ea/images/captura_de_pantalla_20240627_191221.png);
                  background-repeat:repeat;background-position:center top">
                  <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="500">
                    <tr>
                      <td class="esd-structure es-p10t es-p5r es-p5l" align="left" bgcolor="#fff2cc" 
                        style="background-color:#fcfcfc;background-repeat:no-repeat;background-position:center top;background-size:auto contain">
                        <table cellpadding="0" cellspacing="0" align="right" class="es-right">
                          <tr>
                            <td width="490" class="esd-container-frame" align="center" valign="top">
                              <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                  <td align="center" class="esd-block-text es-p10b es-m-txt-c es-text-2036">
                                    <p style="font-size:26px;line-height:150% !important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'" align="center">
                                      TU CUENTA HA SIDO DESBLOQUEADA
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" class="esd-block-text es-p40r es-p40l es-m-p0r es-m-p0l es-text-3299 es-p25t es-p25b">
                                    <p style="font-size:18px;line-height:200% !important" align="center">Hola ${user.name},</p>
                                    <p style="font-size:18px;line-height:200% !important" align="center">
                                      Nos alegra informarte que tu cuenta ha sido desbloqueada y puedes volver a acceder a nuestros servicios.
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" class="esd-block-text es-p10t es-p5b">
                                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" class="esd-block-text es-p5t es-p5b es-p40r es-p40l es-m-p0r es-m-p0l">
                                    <p>Gracias por tu comprensión.</p>
                                    <p><strong>EL PLAC FERIAS - COMPRÁ, VENDÉ, RECICLÁ, RENOVÁ.</strong></p>
                                    <p><strong>Ingresa a nuestra tienda y seguínos en redes!</strong></p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });
    return 'usuario desbloqueado';
}

  
  async sendEmail(data: SendEmailDto): Promise<void> {
    const { name, email, subject, message } = data;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL,
      subject,
      html: `
        <h3>Nuevo mensaje desde el formulario de contacto</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(
        'Hubo un problema al intentar enviar el correo. Por favor, intente más tarde.',
      );
    }
  }
}
