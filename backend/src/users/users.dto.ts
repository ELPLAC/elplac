import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { Role } from '@users/roles/roles.enum';
import { IsDniValidConstraint } from '@auth/auth.validator';
import { Type } from 'class-transformer';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsString()
  @Validate(IsDniValidConstraint)
  dni?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsString()
  @IsOptional()
  profile_picture?: string;

  @IsEmpty()
  role: Role;
}
export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty() 
  @Type(() => Boolean)
  rememberMe: boolean;

}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  current_password: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmNewPassword: string;
}

export class RegisterUserFairDto {
  @IsString()
  selectedHour: string;

  @IsNotEmpty()
  @Type(() => Date)
  selectedDay: Date; 
}

export class SendEmailDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El asunto es obligatorio' })
  @MaxLength(100, { message: 'El asunto no puede exceder los 100 caracteres' })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  @MaxLength(500, { message: 'El mensaje no puede exceder los 500 caracteres' })
  message: string;

  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;
}

