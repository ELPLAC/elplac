import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import {
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
} from '@users/users.dto';
import { RegisterSellerDto } from '@sellers/sellers.dto';
import { Request, Response } from 'express';
import { UsersService } from '@users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get('googleLogin')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req, @Query('role') role: string) {
    req.role = role;
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const role = req.role || 'user';
    await this.authService.googleLogin(req.user, role);
    const user = await this.userService.findByEmail(req.user.email);
    const jwtToken = await this.authService.createJwtToken(user);
    const frontendUrl = await this.authService.getFrontendUrl();

    res
      .status(HttpStatus.OK)
      .redirect(
        `${frontendUrl}/auth/success/?token=${jwtToken}&role=${user.role}`,
      );
  }

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

  @Get('protected')
  getAuthProtected(@Req() req: Request) {
    return JSON.stringify(req.oidc?.user || { message: 'No user found' });
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
