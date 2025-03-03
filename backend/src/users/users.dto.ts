import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { Role } from '@users/roles/roles.enum';
import { IsDniValidConstraint } from '@auth/auth.validator';
import { Type } from 'class-transformer';

export class RegisterUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  @IsString()
  lastname: string;

  @IsString()
  @Validate(IsDniValidConstraint)
  dni?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-]).{8,15}$/, {
    message: 'La contraseña es muy debil',
  })
  @IsString()
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-]).{8,15}$/, {
    message: 'La contraseña es muy debil',
  })
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
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-]).{8,15}$/, {
    message: 'La contraseña es muy debil',
  })
  @IsString()
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-]).{8,15}$/, {
    message: 'La contraseña es muy debil',
  })
  @IsString()
  confirmPassword: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-]).{8,15}$/, {
    message: 'La contraseña es muy debil',
  })
  @IsString()
  current_password: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-]).{8,15}$/, {
    message: 'La contraseña es muy debil',
  })
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-]).{8,15}$/, {
    message: 'La contraseña es muy debil',
  })
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

