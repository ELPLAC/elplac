import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '@products/services/products.service';
import { ProductsDto } from '@products/dtos/products.dto';
import { Product } from '@products/entities/products.entity';
import { UpdateProductDTO } from '@products/dtos/UpdateStatus.dto';
import { AuthGuard } from '@auth/auth.guard';
import { Roles } from '@users/roles/roles.decorator';
import { Role } from '@users/roles/roles.enum';
import { RoleGuard } from '@users/roles/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.SELLER, Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Post(':sellerId/:fairsId')
  async createProducts(
    @Body('createProducts') createProducts: ProductsDto[],
    @Param('sellerId') sellerId: string,
    @Param('fairsId') fairId: string,
  ) {
    return await this.productsService.createProducts(
      createProducts,
      sellerId,
      fairId,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async getProducts() {
    return await this.productsService.getProducts();
  }

  @Get('fair/:fairsId')
  async getProductsByFair(@Param('fairsId') fairsId: string) {
    try {
      return await this.productsService.getProductsByFair(fairsId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'Error: No hay una feria activa para generar las etiquetas.',
        );
      }
      throw error;
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateProduct: UpdateProductDTO,
  ) {
    return await this.productsService.updateStatus(id, updateProduct);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('update/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProduct: Partial<ProductsDto>,
  ) {
    return await this.productsService.updateProduct(id, updateProduct);
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('seller/:sellerId')
  async getSellerProducts(@Param('sellerId') sellerId: string) {
    return await this.productsService.getSellerProducts(sellerId);
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('products/:productsId')
  async getProductsWithSeller(@Param('productsId') fairsId: string) {
    return await this.productsService.getProductsWithSeller(fairsId);
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.productsService.getProductById(id);
  }
}
