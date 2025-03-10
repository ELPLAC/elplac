import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { Roles } from '@users/roles/roles.decorator';
import { Role } from '@users/roles/roles.enum';
import { AuthGuard } from '@auth/auth.guard';
import { RoleGuard } from '@users/roles/roles.guard';
import {
  RegisterUserDto,
  RegisterUserFairDto,
  SendEmailDto,
  UpdatePasswordDto,
} from '@users/users.dto';
import { User } from '@users/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get('uniquedata')
  async getUserByEmailAndDni(): Promise<{ userInfo: User[] }> {
    return await this.usersService.getUserByEmailAndDni();
  }

  @UseGuards(AuthGuard)
  @Put('update-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() data: UpdatePasswordDto,
  ): Promise<string> {
    return await this.usersService.updatePassword(id, data);
  }

  @UseGuards(AuthGuard)
  @Post(':userId/register/fair/:fairId')
  async registerUserFair(
    @Param('fairId') fairId: string,
    @Param('userId') userId: string,
    @Body() selectedHour: RegisterUserFairDto,
  ) {
    try {
      const result = await this.usersService.registerUserFair(
        fairId,
        userId,
        selectedHour,
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al procesar la inscripción',
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':userId/reschedule/fair/:fairId')
  async rescheduleUserFair(
    @Param('fairId') fairId: string,
    @Param('userId') userId: string,
    @Body() selectedHour: RegisterUserFairDto,
  ) {
    try {
      const result = await this.usersService.rescheduleUserFair(
        fairId,
        userId,
        selectedHour,
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al reprogramar el turno',
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':userId/cancel/fair/:fairId')
  async cancelUserFair(
    @Param('fairId') fairId: string,
    @Param('userId') userId: string,
  ) {
    try {
      const result = await this.usersService.cancelUserFair(fairId, userId);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al cancelar el turno',
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUserById(id);
  }

  @UseGuards(AuthGuard)
  @Put('changeRole/:id')
  async changeRole(
    @Param('id') id: string,
    @Body('role') role: Role,
  ): Promise<{ message: string }> {
    await this.usersService.changeRole(id, role);
    return { message: 'Tu rol ha sido cambiado' };
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: Partial<RegisterUserDto>,
  ): Promise<string> {
    return await this.usersService.updateUser(id, user);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('block/:id')
  async blockUser(@Param('id') id: string) {
    return await this.usersService.blockUser(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('unblock/:id')
  async unblockUser(@Param('id') id: string) {
    return await this.usersService.unblockUser(id);
  }

  @Post('contact')
  async sendEmail(@Body() data: SendEmailDto) {
    return await this.usersService.sendEmail(data);
  }

  @Post('subscribe')
  async subscribe(@Body('email') email: string) {
    return await this.usersService.subscribe(email);
  }
}
