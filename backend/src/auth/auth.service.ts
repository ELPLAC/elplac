import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
} from '@users/users.dto';
import { User } from '@users/users.entity';
import { SellerRepository } from '@sellers/sellers.repository';
import { RegisterSellerDto } from '@sellers/sellers.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@users/roles/roles.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { config as dotenvConfig } from 'dotenv';
import { UsersService } from '@users/users.service';
import { Response } from 'express';
import { runWithTryCatchBadRequestE } from '@errors/errors';

dotenvConfig({ path: '.env' });

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly sellerRepository: SellerRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async registerUser(user: RegisterUserDto): Promise<string> {
    const userFound = await this.userService.findByEmail(user.email);
    if (userFound) throw new NotFoundException('El mail del usuario ya existe');
    const userDni = await this.userService.findByDni(user.dni);
    if (userDni) throw new NotFoundException('El dni del usuario ya existe');
    const newUser = await this.userService.registerUser(user);

    const token = this.jwtService.sign(
      { email: newUser.email },
      { secret: process.env.JWT_SECRET },
    );
    await this.sendEmailVerification(newUser.email, token);
    return 'Usuario registrado, revise su correo para verificar el registro';
  }

  async registerSeller(sellerData: RegisterSellerDto): Promise<string> {
    const sellerFound = await this.userService.findByEmail(sellerData.email);
    if (sellerFound) throw new NotFoundException('El usuario ya existe');
    await this.sellerRepository.sellerRegister(sellerData);

    const token = this.jwtService.sign(
      { email: sellerData.email },
      { secret: process.env.JWT_SECRET },
    );
    await this.sendEmailVerification(sellerData.email, token);
    return 'Vendedor registrado, revise su correo para verificar el registro';
  }

  async verifyEmail(token: string, res: Response) {
    try {
      const { email } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      }) as { email: string };

      const user = await this.userService.findByEmail(email);
      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      user.status = true;
      await this.userService.saveUser(user);

      const redirectUrl = `${process.env.FRONTEND_URL}/login`;

      return res.redirect(redirectUrl);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async sendEmailVerification(email: string, token: string) {
    try {
      const url = `https://elplac-production-3a9f.up.railway.app/auth/verify-email/${token}`;
  
      const htmlContent = `
        <td class="esd-stripe" align="center" background="https://ehserys.stripocdn.email/content/guids/CABINET_5c258a4c32f0353efed35594869ddf77f5d9197eca7f50e5ffd2d04a758e69ea/images/captura_de_pantalla_20240627_191221.png" style="background-image:url(https://ehserys.stripocdn.email/content/guids/CABINET_5c258a4c32f0353efed35594869ddf77f5d9197eca7f50e5ffd2d04a758e69ea/images/captura_de_pantalla_20240627_191221.png);background-repeat:repeat;background-position:center top">
          <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="500">
            <tbody>
              <tr>
                <td class="esd-structure es-p10t es-p5r es-p5l" align="left" bgcolor="#fff2cc" style="background-color:#fcfcfc;background-repeat:no-repeat;background-position:center top;background-size:auto contain">
                  <table cellpadding="0" cellspacing="0" align="right" class="es-right">
                    <tbody>
                      <tr>
                        <td width="490" class="esd-container-frame" align="center" valign="top">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td align="center" class="esd-block-text es-p10b es-m-txt-c es-text-2036"> 
                                  <p style="font-size:26px;line-height:150% !important;font-family:-apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,Roboto,Helvetica,Arial,sans-serif,&#39;Apple Color Emoji&#39;,&#39;Segoe UI Emoji&#39;,&#39;Segoe UI Symbol&#39;" align="center">CONFIRMA TU CUENTA!</p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="esd-block-text es-p40r es-p40l es-m-p0r es-m-p0l es-text-3299 es-p25t es-p25b"> 
                                  <p style="font-size:18px;line-height:200% !important" align="center">
                                    Has recibido este mensaje porque tu dirección de correo electrónico ha sido registrada en nuestro sitio. 
                                    Por favor, haz clic en el botón de abajo para verificar tu dirección de correo electrónico y confirmar que eres el propietario de esta cuenta.
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="esd-block-text es-p10t es-p5b"> 
                                  <p>Si no te registraste con nosotros, por favor ignora este correo electrónico.</p><p>​</p> 
                                </td>
                              </tr>
                              <tr>
                                <td align="center">
                                  <span style="border-radius:6px;border-style:solid;border-width:1px;border-color:#333333; padding: .5em;">
                                    <a href="${url}" target="_blank" style="border-radius:6px;color:#333333;padding:305px 85px;font-size:18px;text-decoration:none;">
                                      CONFIRMA TU CUENTA
                                    </a>
                                  </span>
                                </td>
                              </tr>                      
                              <tr>
                                <td align="center" class="esd-block-text es-p5t es-p5b es-p40r es-p40l es-m-p0r es-m-p0l"> 
                                  <p>​</p><p>Una vez confirmado, este correo electrónico estará asociado de manera única a tu cuenta.&nbsp;</p><p>​</p> 
                                  <p><strong> EL PLAC FERIAS - COMPRÁ, VENDÉ, RECICLÁ, RENOVÁ</strong></p> 
                                  <p><strong>Ingresa a nuestra tienda y seguínos en redes!</strong></p> 
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="esd-block-social es-p15t es-p15b" style="font-size:0">
                                  <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social">
                                    <tbody>
                                      <tr>
                                        <td align="center" valign="top" class="es-p40r es-m-p0r"><a target="_blank" href="https://www.facebook.com/elplacarddemibebot"><img title="Facebook" src="https://ehserys.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" width="32"></a> </td>
                                        <td align="center" valign="top" class="es-p40r es-m-p0r"><a target="_blank" href="https://elplacarddemibebot.mitiendanube.com/"><img title="X.com" src="https://ehserys.stripocdn.email/content/assets/img/social-icons/logo-black/x-logo-black.png" alt="X" width="32"></a> </td>
                                        <td align="center" valign="top"><a target="_blank" href="https://www.instagram.com/el_placard_de_mi_bebot"><img title="Instagram" src="https://ehserys.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32"></a> </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table> 
                        </td>
                      </tr>
                    </tbody>
                  </table> 
                </td>
              </tr>
            </tbody>
          </table> 
        </td>`;
  
      await this.mailService.sendMail({
        to: email,
        subject: 'Confirma tu cuenta',
        html: htmlContent,  
      });
    } catch (error) {
      console.error('Error al enviar correo de verificación:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo de verificación');
    }
  }
  

  async loginUser({ email, password }: LoginUserDto) {
    const user = await this.userService.findByEmail(email);
  
    if (!user) {
      throw new UnauthorizedException('Usuario inexistente');
    }
  
    if (user.status === false) {  
      throw new UnauthorizedException('Debes confirmar tu cuenta');
    }
  
    const passwordValid = await bcrypt.compare(password, user.password);
  
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales Invalidas');
    }
  
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
  
    return {
      message: 'usuario logueado exitosamente',
      token,
      role: user.role,
    };
  }
  
  
  async googleLogin(payload: any, role: string) {
    return runWithTryCatchBadRequestE(async () => {
      const user = await this.userService.findByEmail(payload.email);
      if (user) {
        return user;
      }
      const newUser = new User();
      newUser.email = payload.email;
      newUser.name = payload.firstName || '';
      newUser.lastname = payload.lastName || '';
      newUser.dni = '';
      newUser.password = '';
      newUser.role = role === 'seller' ? Role.SELLER : Role.USER;
      newUser.registration_date = new Date();
      newUser.status = true;
      newUser.profile_picture =
        payload.picture ||
        'https://res.cloudinary.com/dpso5fsug/image/upload/v1719432779/el_placard_de_mi_bebot/scuh9cj2v97xflgtahm8.png';

      return await this.userService.createUserAuth0(newUser);
    });
  }

  async getFrontendUrl(): Promise<string> {
    return process.env.FRONTEND_URL || 'https://elplac-ruby.vercel.app';
  }

  async createJwtToken(user: any) {
    return runWithTryCatchBadRequestE(async () => {
      const userId = await this.userService.findByEmail(user.email);
      const payload = { id: userId.id, email: user.email, role: user.role };
      return this.jwtService.sign(payload);
    });
  }

  async sendPasswordResetLink(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const token = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );
    await this.sendEmailResetPassword(user.email, token);
  }

  async sendEmailResetPassword(email: string, token: string): Promise<void> {
    const url = `https://elplac-production-3a9f.up.railway.app/auth/reset-password/${token}`;
    const htmlContent = `
      <table class="esd-stripe" align="center" bgcolor="#cfe2f3" style="background-repeat:repeat">
        <tbody>
          <tr>
            <td class="esd-structure es-p15t es-p20r es-p20l" align="left" bgcolor="#fff2cc" style="background-color:#fff2cc;">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                  <tr>
                    <td width="560" class="esd-container-frame" align="center" valign="top">
                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                          <tr>
                            <td align="center" class="esd-block-text es-p15t es-p15b es-p40r es-p40l es-m-p0r es-m-p0l es-m-txt-c es-text-6349" esd-links-underline="none">
                              <h1 align="center" style="font-size:36px;line-height:150%;background:transparent">Restablecer contraseña​</h1>
                            </td>
                          </tr>
                          <tr>
                            <td align="left" class="esd-block-text es-p10t">
                              <p>Después de hacer clic en el botón "RESTABLECER CONTRASEÑA", se te pedirá que completes los siguientes pasos:</p>
                              <ol>
                                <li>Ingresa una nueva contraseña.</li>
                                <li>Confirma tu nueva contraseña.</li>
                                <li>Haz clic en Enviar.</li>
                              </ol>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" class="esd-block-button es-p10t es-p10b">
                              <span class="es-button-border" style="border-radius:6px;border-style:solid;border-width:1px;border-color:#333333;padding: .5em;">
                                <a href="${url}" class="es-button es-button-8530" target="_blank" style="border-left-width:30px;border-right-width:30px;border-radius:6px;mso-border-alt:10px solid #9fc5e8;color:#333333;text-decoration:none;">RESTABLECER CONTRASEÑA</a>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td class="esd-structure es-p20b es-p20r es-p20l" align="left" bgcolor="#cfe2f3" style="background-color:#cfe2f3;">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                  <tr>
                    <td width="560" class="esd-container-frame" align="center" valign="top">
                      <table cellpadding="0" cellspacing="0" width="100%" style="border-radius: 5px; border-collapse: separate;">
                        <tbody>
                          <tr>
                            <td align="center" class="esd-block-text es-p10t es-m-txt-c">
                              <h3 style="line-height: 350%;">Este link es válido para usar UNA vez. Expira en 1 hora.</h3>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" class="esd-block-text es-p10t es-p10b">
                              <p style="line-height: 150%;">Si no solicitaste restablecer tu contraseña, por favor ignora este mensaje o contacta a nuestro departamento de servicio al cliente.</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    try {
      await this.mailService.sendMail({
        to: email,
        subject: 'Solicitud de restablecimiento de contraseña',
        html: htmlContent, 
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al enviar el correo de restablecimiento de contraseña',
      );
    }
  }
  
  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = decoded.userId;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      await this.userService.resetPassword(user, resetPasswordDto);

    } catch (error) {
      throw new InternalServerErrorException('Token inválido o expirado');
    }
  }
}
