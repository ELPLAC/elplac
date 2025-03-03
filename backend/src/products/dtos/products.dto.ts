import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class ProductsDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  size: string;
}
