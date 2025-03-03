import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '@users/users.repository';
import {
  RegisterUserDto,
  RegisterUserFairDto,
  ResetPasswordDto,
  SendEmailDto,
  UpdatePasswordDto,
} from '@users/users.dto';
import { User } from '@users/users.entity';
import * as bcrypt from 'bcrypt';
import {
  runWithTryCatchBadRequestE,
  runWithTryCatchNotFoundE,
} from '@errors/errors';
import { Role } from '@users/roles/roles.enum';
import { UserToSellerService } from '@users/changeRole';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userToSellerService: UserToSellerService,
  ) {}

  async getAllUsers() {
    return runWithTryCatchNotFoundE(async () => {
      return await this.userRepository.getAllUsers();
    });
  }

  async getUserByEmailAndDni(): Promise<{
    userInfo: User[];
  }> {
    return await this.userRepository.getUserByEmailAndDni();
  }

  async updatePassword(id: string, data: UpdatePasswordDto): Promise<string> {
    return await this.userRepository.updatePassword(id, data);
  }

  async registerUserFair(
    fairId: string,
    userId: string,
    selectedHour: RegisterUserFairDto,
  ) {
    return await this.userRepository.registerUserFair(
      fairId,
      userId,
      selectedHour,
    );
  }

  async getUserById(id: string): Promise<User> {
    return runWithTryCatchNotFoundE(async () => {
      return await this.userRepository.getUserById(id);
    });
  }

  async changeRole(id: string, role: Role): Promise<void> {
    return runWithTryCatchBadRequestE(async () => {
      await this.userToSellerService.changeRole(id, role);
    });
  }

  async updateUser(
    id: string,
    user: Partial<User>,
  ): Promise<string> {
    runWithTryCatchNotFoundE(async () => {
      await this.userRepository.updateUser(id, user);
    });
    return 'Se ha actualizado el usuario';
  }

  async blockUser(id: string) {
    return await this.userRepository.blockUser(id);
  }

  async unblockUser(id: string) {
    return await this.userRepository.unblockUser(id);
  }

  async findByDni(dni: string): Promise<User> {
    return await this.userRepository.findByDni(dni);
  }

  async findByEmail(email: string): Promise<User> {
    return runWithTryCatchNotFoundE(async () => {
      return await this.userRepository.findByEmail(email);
    });
  }

  async resetPassword(
    user: User,
    newPassword: ResetPasswordDto,
  ): Promise<string> {
    const { password, confirmPassword } = newPassword;
    if (password !== confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');

    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword)
      throw new BadRequestException('Error al encriptar la clave');
    user.password = hashedPassword;
    runWithTryCatchBadRequestE(async () => {
      await this.userRepository.resetPassword(user);
    });
    return 'contraseña actualizada';
  }

  async createUserAuth0(user: Partial<User>) {
    return runWithTryCatchBadRequestE(async () => {
      return await this.userRepository.createUserAuth0(user);
    });
  }

  async saveUser(user: User): Promise<User> {
    return runWithTryCatchBadRequestE(async () => {
      return await this.userRepository.saveUser(user);
    });
  }

  async registerUser(user: Partial<RegisterUserDto>) {
    if (user.password !== user.confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');
    const hashedPassword = await bcrypt.hash(user.password, 12);
    if (!hashedPassword)
      throw new BadRequestException('Error al encriptar la clave');

    const newUser = { ...user, password: hashedPassword };
    return runWithTryCatchBadRequestE(async () => {
      return await this.userRepository.registerUser(newUser);
    });
  }

  async sendEmail(data: SendEmailDto){
    return await this.userRepository.sendEmail(data);
  }

  async subscribe(email: string) {
    return await this.userRepository.subscribe(email);
  }
}
