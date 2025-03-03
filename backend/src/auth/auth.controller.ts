import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import {
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
} from '@users/users.dto';
import { RegisterSellerDto } from '@sellers/sellers.dto';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register/user')
  async registerUser(@Body() userDto: RegisterUserDto) {
    return this.authService.registerUser(userDto);
  }

  @Post('register-seller')
  async registerSeller(@Body() sellerData: RegisterSellerDto) {
    return this.authService.registerSeller(sellerData);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    await this.authService.verifyEmail(token, res);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<void> {
    return this.authService.sendPasswordResetLink(email);
  }

  @Put('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.resetPassword(token, resetPasswordDto);
    res
      .status(HttpStatus.OK)
      .json({ message: 'Contraseña actualizada exitosamente' });
  }
}
