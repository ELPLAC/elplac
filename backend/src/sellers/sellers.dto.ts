import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsDniValidConstraint } from '@auth/auth.validator';

export class RegisterSellerDto {
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

  @IsNotEmpty()
  @IsString()
  @Validate(IsDniValidConstraint)
  dni: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  address?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-]).{8,15}$/, {
    message: 'El password es muy debil',
  })
  @IsString()
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-]).{8,15}$/, {
    message: 'El password es muy debil',
  })
  @IsString()
  confirmPassword: string;

  @IsString()
  @IsOptional()
  profile_picture?: string;

  @IsString()
  @IsOptional()
  social_media?: string;
}
