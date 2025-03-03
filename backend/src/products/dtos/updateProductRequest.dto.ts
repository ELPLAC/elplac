import { IsString, IsNotEmpty } from 'class-validator';
import { ProductStatus } from '@products/enum/productStatus.enum';

export class UpdateProductRequestDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    status: ProductStatus;
}
