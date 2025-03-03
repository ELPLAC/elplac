import { IsEnum } from 'class-validator';
import { ProductStatus } from '@products/enum/productStatus.enum';

export class UpdateProductDTO {
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
