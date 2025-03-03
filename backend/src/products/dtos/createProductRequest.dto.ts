import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductsDto } from '@products/dtos/products.dto';

export class CreateProductRequestDto {
  @IsNotEmpty()
  sellerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsDto)
  products: ProductsDto[];

  @IsNotEmpty()
  fairId: string;
}
