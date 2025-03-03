import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductRequestService } from '@products/services/productRequest.service';
import { CreateProductRequestDto } from '@products/dtos/createProductRequest.dto';
import { UpdateProductRequestDto } from '@products/dtos/updateProductRequest.dto';
import { Roles } from '@users/roles/roles.decorator';
import { Role } from '@users/roles/roles.enum';
import { AuthGuard } from '@auth/auth.guard';
import { RoleGuard } from '@users/roles/roles.guard';

@Controller('product-request')
export class ProductRequestController {
  constructor(private readonly productRequestService: ProductRequestService) {}

  @Roles(Role.SELLER, Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  async createProductRequest(
    @Body() createProductRequestDto: CreateProductRequestDto,
  ) {
    const productRequest =
      await this.productRequestService.createProductRequest(
        createProductRequestDto,
      );
    return {
      message: 'Productos cargados, seran revisados por el administrador',
      productRequest,
    };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id')
  async updateProductRequest(
    @Param('id') id: string,
    @Body() productRequest: UpdateProductRequestDto,
  ) {
    const { productId, status } = productRequest;
    await this.productRequestService.updateProductRequest(
      id,
      productId,
      status,
    );
    return { message: 'El producto ha sido clasificado correctamente' };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('check/:id')
  async checkedProductRequest(@Param('id') id: string) {
    await this.productRequestService.checkedProductRequest(id);
    return { message: 'El productrequest ha sido actualizado correctamente' };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async getAllProductRequest() {
    return await this.productRequestService.getAllProductRequest();
  }

  @Roles(Role.SELLER, Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  async getProductRequestById(@Param('id') id: string) {
    return await this.productRequestService.getProductRequestById(id);
  }
}
