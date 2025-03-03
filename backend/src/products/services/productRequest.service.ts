import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductRequestDto } from '@products/dtos/createProductRequest.dto';
import { ProductRequest } from '@products/entities/productRequest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '@products/services/products.service';
import { Fair } from '@fairs/entities/fairs.entity';
import { ProductStatus } from '@products/enum/productStatus.enum';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { Product } from '@products/entities/products.entity';
import { StatusProductRequest } from '@products/enum/statusProductRequest.enum';

@Injectable()
export class ProductRequestService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(ProductRequest)
    private readonly productRequestRepository: Repository<ProductRequest>,
    @InjectRepository(Fair) private readonly fairRepository: Repository<Fair>,
    @InjectRepository(FairCategory)
    private readonly fairCategoryRepository: Repository<FairCategory>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async createProductRequest(createProductRequestDto: CreateProductRequestDto) {
    const { sellerId, products, fairId } = createProductRequestDto;
    return await this.productsService.createProducts(
      products,
      sellerId,
      fairId,
    );
  }

  async updateProductRequest(
    id: string,
    productId: string,
    status: ProductStatus,
  ) {

    const productRequest = await this.productRequestRepository.findOne({
      where: { id: id },
      relations: { seller: true, fair: true, products: true },
    });
    if (!productRequest)
      throw new BadRequestException(`La solicitud de producto ${id} no existe`);

    const fair = await this.fairRepository.findOne({
      where: { id: productRequest.fair.id },
    });
    if (!fair)
      throw new BadRequestException(
        `La feria ${productRequest.fair.id} no existe`,
      );

    const product = await this.productsRepository.findOne({
      where: { id: productId, productRequest: productRequest },
    });
    if (!product)
      throw new BadRequestException(`El producto ${productId} no existe`);

    const category = await this.productRequestRepository.findOne({
      where: { category: productRequest.category },
    });
    if (!category)
      throw new BadRequestException(
        `La categoria ${category} no existe`,
      );

    const fairCategory = await this.fairCategoryRepository.findOne({
      where: { fair: fair },
      relations: { products: true, category: true },
    });
    if (!fairCategory)
      throw new BadRequestException(
        `La categoria ${category} no existe en la feria ${productRequest.fair.id}`,
      );

    product.status = status;

    await this.productsRepository.save(product);

    if (product.status === ProductStatus.ACCEPTED) {
      if (fairCategory.maxProducts < 1) {
        throw new BadRequestException(
          `No hay mas cupos de productos para esta categoria`,
        );
      } else {
        fairCategory.products.push(product);
        fairCategory.maxProducts--;
        await this.fairCategoryRepository.save(fairCategory);
      }
    }

    await this.productRequestRepository.save(productRequest);
   
    return productRequest;
  }

  async checkedProductRequest(id: string) {
    const productRequest = await this.productRequestRepository.findOne({
      where: { id: id },
    });
    if (!productRequest)
      throw new BadRequestException(`La solicitud no existe`);
    productRequest.status = StatusProductRequest.CHECKED;
    await this.productRequestRepository.save(productRequest);
  }

  async getAllProductRequest() {
    const result = await this.productRequestRepository.find({
      relations: ['seller', 'seller.user', 'fair', 'products'],
    });
    return result;
  }
  

  async getProductRequestById(id: string) {
    const result = await this.productRequestRepository.findOne({
      where: { id: id },
      relations: ['seller', 'seller.user', 'fair', 'products'],
    });
    return result;
  }
  
}
