import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Seller } from '@sellers/sellers.entity';
import { RegisterSellerDto } from '@sellers/sellers.dto.js';
import { Role } from '@users/roles/roles.enum';
import { User } from '@users/users.entity';
import { UsersService } from '@users/users.service';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { SellerStatus } from '@sellers/sellers.enum';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { Fair } from '@fairs/entities/fairs.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UserStatusGeneral } from '@users/users.enum';

@Injectable()
export class SellerRepository {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    private readonly userService: UsersService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(SellerFairRegistration)
    private readonly sellerFairRegistrationRepository: Repository<SellerFairRegistration>,
    @InjectRepository(FairCategory)
    private readonly fairCategoryRepository: Repository<FairCategory>,
    @InjectRepository(Fair) private readonly fairRepositoryDB: Repository<Fair>,
    private readonly mailService: MailerService,
  ) {}

  async sellerRegister(
    sellerData: RegisterSellerDto,
  ): Promise<Partial<Seller>> {
    const {
      name,
      lastname,
      email,
      confirmPassword,
      password,
      dni,
      profile_picture,
    } = sellerData;

    const sellerX = this.sellerRepository.create();
    sellerX.social_media = sellerData.social_media;
    sellerX.phone = sellerData.phone;
    sellerX.address = sellerData.address;
    sellerX.sku = '';
    await this.sellerRepository.save(sellerX);

    const userRegistered = await this.userService.registerUser({
      name,
      lastname,
      email,
      confirmPassword,
      password,
      dni,
      profile_picture,
      role: Role.SELLER,
    });
    userRegistered.seller = sellerX;
    await this.usersRepository.save(userRegistered);

    const user = await this.userService.findByEmail(email);

    const skuId = user.id[0] + user.id[1];
    const splitname = user.name.split(' ');
    splitname.push(user.lastname);
    const initials = splitname.map((element) => {
      return element[0];
    });
    const joinedInitials = initials.join('');

    sellerX.sku = `${joinedInitials}${skuId}`;
    await this.sellerRepository.save(sellerX);

    return sellerX;
  }

  async registerFair(
    sellerId: string,
    fairId: string,
    fairCategoryId: string,
    liquidation: string,
  ): Promise<string> {
    try {
      const fair = await this.fairRepositoryDB.findOneBy({ id: fairId });
      if (!fair) {
        throw new NotFoundException('Feria no encontrada');
      }
      if (fair.isActive === false) {
        throw new BadRequestException('Feria cerrada');
      }

      const seller = await this.sellerRepository.findOne({
        where: { id: sellerId },
        relations: ['user'],
      });
      if (!seller) {
        throw new NotFoundException('Vendedor no encontrado');
      }

      const fairCategory = await this.fairCategoryRepository.findOne({
        where: { id: fairCategoryId },
        relations: ['category'],
      });
      if (!fairCategory) {
        throw new NotFoundException('Categoría no encontrada');
      }

      if (fairCategory.maxSellers <= 0) {
        throw new BadRequestException('Categoría llena');
      }

      const existingRegistration =
        await this.sellerFairRegistrationRepository.findOne({
          where: {
            seller: { id: sellerId },
            fair: { id: fairId },
            categoryFair: { id: fairCategoryId },
          },
        });

      if (existingRegistration) {
        throw new BadRequestException(
          'El vendedor ya está registrado en esta feria y categoría',
        );
      }

      fairCategory.maxSellers -= 1;
      await this.fairCategoryRepository.save(fairCategory);

      let newLiquidation: boolean;
      if (liquidation === 'si') {
        newLiquidation = true;
      } else {
        newLiquidation = false;
      }

      const sellerRegistration = new SellerFairRegistration();
      sellerRegistration.registrationDate = new Date();
      sellerRegistration.entryFee = fair.entryPriceSeller;
      sellerRegistration.liquidation = newLiquidation;
      sellerRegistration.seller = seller;
      sellerRegistration.fair = fair;
      sellerRegistration.categoryFair = fairCategory;

      await this.sellerFairRegistrationRepository.save(sellerRegistration);

      seller.status = SellerStatus.ACTIVE;
      await this.sellerRepository.save(seller);

      const user = await this.userService.findByEmail(seller.user.email);
      user.statusGeneral = UserStatusGeneral.ACTIVE;
      await this.usersRepository.save(user);

      await this.sendEmailVerification(seller.user.email);
      return 'Vendedor registrado correctamente';
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Error al registrar vendedor en la feria');
    }
  }

  async sendEmailVerification(email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email });
    const name = user.name;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de inscripción a Feria</title>
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
  
            a {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: var(--primary-default);
              color: black;
              text-decoration: none;
              border-radius: 5px;
            }
  
            a:hover {
              background-color: var(--primary-dark);
            }
  
            .footer {
              text-align: center;
              margin-top: 20px;
              color: var(--primary-light);
              font-size: 12px;
            }
  
            .qr-container {
              text-align: center;
              margin-top: 20px;
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
  
            .header {
              background-color: var(--secondary-default);
              padding: 10px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
  
            .header h1 {
              color: var(--secondary-darker);
              margin: 0;
            }
  
            .footer p {
              color: var(--secondary-dark);
            }
  
            .container {
              border: 2px solid var(--secondary-default);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Confirmación de inscripción</h1>
            </div>
            <h1>Hola ${name},</h1>
            <p>¡Te has inscrito exitosamente en la feria! Ya está habilitada la carga de tus productos en el sistema. Una vez efectuada la totalidad de la carga, por favor revisar detenidamente la información ingresada. Al recibir los productos, serán evaluados por nuestro equipo, y se clasificarán según el criterio de aprobación. Por días y horarios de entrega, ver "Información y Requisitos" de la feria, en la solapa "INFO Y TIPS" en tu cuenta vendedor.</p>
            <div class="footer">
              <p>Si no te has inscrito en la feria, por favor, ignora este correo.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await this.mailService.sendMail({
        to: email,
        subject: 'Registro exitoso en feria',
        html: htmlContent,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al enviar el correo de confirmación de inscripción',
      );
    }
  }

  async sendMailUpdateStatusProducts(sellerIds: string[]): Promise<void> {
    const sellers = await this.sellerRepository.find({
      where: { id: In(sellerIds) },
      relations: ['user'], 
  });
  
    if (!sellers.length) {
      throw new NotFoundException(
        `No se encontraron vendedores con los IDs proporcionados.`,
      );
    }

    for (const seller of sellers) {
      if (!seller.user || !seller.user.email) {
        console.warn(
          `El vendedor con ID ${seller.id} no tiene un email válido.`,
        );
        continue;
      }

      console.log("vendedor encontrado", seller);

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Carga de productos al sistema</title>
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
              .footer {
                text-align: center;
                margin-top: 20px;
                color: var(--primary-light);
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>¡Novedades con tus productos!</h1>
              <p>Tus productos fueron clasificados, ingresa a la página para verificar.</p>
              <div class="footer">
                <p>EL PLAC FERIAS.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      try {
        console.log(`Enviando correo a: ${seller.user.email}`);

        await this.mailService.sendMail({
          to: seller.user.email,
          subject: 'Actualización de productos',
          html: htmlContent,
        });

        console.log(`Correo enviado con éxito a ${seller.user.email}`);
      } catch (error) {
        console.error(`Error al enviar correo a ${seller.user.email}:`, error);
      }
    }
  }

  async getSellerById(sellerId: string) {
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
      relations: {
        products: {
          fairCategory: {
            category: true,
          },
        },
        user: true,
        registrations: {
          fair: true,
          categoryFair: {
            category: true,
          },
        },
      },
    });

    if (!seller) throw new NotFoundException('Vendedor no encontrado');
    return seller;
  }

  async findByPhone(phone: string) {
    return await this.sellerRepository.findOneBy({ phone: phone });
  }

  async updateNoVerifySeller(sellerId: string) {
    const seller = await this.getSellerById(sellerId);
    seller.status = SellerStatus.NO_ACTIVE;
    await this.sellerRepository.save(seller);
    return 'Vendedor rechazado correctamente';
  }

  async getSellerByIdWithProducts(sellerId: string) {
    const seller = await this.sellerRepository.findOne({
      where: { id: sellerId },
      relations: { products: true, registrations: { fair: true } },
    });
    if (!seller) throw new NotFoundException('Vendedor no encontrado');
    return seller;
  }

  async getAllSellers() {
    const sellers = await this.sellerRepository.find({
      relations: {
        user: true,
        products: true,
        registrations: {
          fair: true,
          categoryFair: {
            category: true,
          },
        },
      },
    });
    return sellers;
  }

  async updateSeller(id: string, seller: any) {
    const sellerToUpdate = await this.sellerRepository.findOneBy({ id });
    if (!sellerToUpdate) throw new NotFoundException('Vendedor no encontrado');
    Object.assign(sellerToUpdate, seller);
    return await this.sellerRepository.save(sellerToUpdate);
  }
}
