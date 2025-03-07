import { Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from './users/roles/roles.enum';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno
@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly userService: UsersService) {}

  async onModuleInit() {
    console.log('Iniciando la creación del administrador...');

    const admin = {
      name: process.env.ADMIN_NAME,
      lastname: process.env.ADMIN_LASTNAME,
      dni: process.env.ADMIN_DNI,
      address: process.env.ADMIN_ADDRESS,
      phone: process.env.ADMIN_PHONE,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      confirmPassword: process.env.ADMIN_PASSWORD, 
      registration_date: new Date(),
      role: 'admin' as Role,
      status: true,
      isVerified: true,
      profile_picture: process.env.ADMIN_PROFILE_PICTURE,
    };

   const existAdmin = await this.userService.findByEmail(admin.email)

   if (!existAdmin) {
      await this.userService.registerUser(admin);
    }

    console.log("administrador creado exitosamente: ", admin);
  }  
}
