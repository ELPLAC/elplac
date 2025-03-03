import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator';

export class PaymentDto {
  @IsArray()
  @IsNotEmpty()
  items: {
    title: string;
    quantity: number;
    unit_price: number;
  }[];

  @IsNumber()
  @IsNotEmpty()
  sellerId: number;

  @IsNumber()
  @IsNotEmpty()
  fairId: number;

  @IsString()
  @IsNotEmpty()
  transactionType: string;
}
