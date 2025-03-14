import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '@products/products.repository';
import { ProductsDto } from '@products/dtos/products.dto';
import { Product } from '@products/entities/products.entity';
import { ProductStatusDescription } from '@products/enum/productStatus.enum';
import { UpdateProductDTO } from '@products/dtos/UpdateStatus.dto';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository
    ) {}

    async createProducts(products: ProductsDto[], sellerId: string, fairId: string) {
        try {
          const pRequestId = await this.productsRepository.createProducts(products, sellerId, fairId);
          return { pRequestId };
        } catch (error) {
          console.error('Error en createProducts:', error); // Agrega esto para depurar
          throw new InternalServerErrorException('Error al crear productos.');
        }
      }
      

    async getProducts() {
        
        const products = await this.productsRepository.getProducts();

        return products.map(product => ({
            ...product, 
            statusDescription: ProductStatusDescription[product.status]
          }));
    }

    async updateStatus(id: string, updateProduct: UpdateProductDTO){
        return await this.productsRepository.updateStatus(id, updateProduct);
    }

    async getProductById(id: string): Promise<Product> {
        return await this.productsRepository.getProductById(id);
    }

    async getSellerProducts(sellerId: string) {
        return await this.productsRepository.getSellerProducts(sellerId);
    }

    async getProductsWithSeller(productId: string) {
        return await this.productsRepository.getProductsWithSeller(productId);
    }

    async getProductsByFair(fairsId: string) {
        try {
          return await this.productsRepository.getProductsByFair(fairsId);
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new NotFoundException('No se encontraron productos porque no hay una feria activa.');
          }
          throw error;
        }
      }

    async updateProduct(id: string, updateProduct: Partial<ProductsDto>) {
        return await this.productsRepository.updateProduct(id, updateProduct);
    }
}
