import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto } from '@categories/categories.dto';

export class FairCategoryDto {
  @IsNumber()
  maxProductsSeller: number;

  @IsNumber()
  minProductsSeller: number;

  @IsNumber()
  maxProducts: number;

  @IsNumber()
  maxSellers: number;

  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;
}

export class FairDayDto {
  @IsDateString()
  day: string;

  @IsString()
  @IsOptional() 
  startTime?: string; 

  @IsString()
  @IsOptional() 
  endTime?: string; 

  @IsBoolean()
  isClosed: boolean; 

  @IsNumber()
  @IsOptional()
  capacityPerTimeSlot?: number;

  @IsNumber()
  @IsOptional()
  timeSlotInterval?: number;
}

export class FairDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  entryPriceSeller: number;

  @IsNumber()
  entryPriceBuyer: number;

  @IsString()
  @IsNotEmpty()
  entryDescription: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FairCategoryDto)
  fairCategories: FairCategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FairDayDto)
  fairDays: FairDayDto[]; 
}
