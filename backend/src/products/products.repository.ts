import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@products/entities/products.entity';
import { Seller } from '@sellers/sellers.entity';
import { ProductsDto } from '@products/dtos/products.dto';
import { UpdateProductDTO } from '@products/dtos/UpdateStatus.dto';
import { Category } from '@categories/categories.entity';
import { Fair } from '@fairs/entities/fairs.entity';
import { SellerFairRegistration } from '@fairs/entities/sellerFairRegistration.entity';
import { ProductRequest } from '@products/entities/productRequest.entity';
import { StatusProductRequest } from '@products/enum/statusProductRequest.enum';
import { SellerStatus } from '@sellers/sellers.enum';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(Fair)
    private readonly fairRepository: Repository<Fair>,
    @InjectDataSource() private dataSource: DataSource,
        private readonly mailService: MailerService,
  ) {}

  async createProducts(
    products: ProductsDto[],
    sellerId: string,
    fairId: string
  ) {
    try {
      const seller = await this.dataSource.manager.findOne(Seller, {
        where: { id: sellerId },
        relations: { products: true },
      });
  
      if (!seller || seller.status === SellerStatus.NO_ACTIVE) {
        throw new NotFoundException(
          "Vendedor no autorizado a cargar los productos"
        );
      }
  
      const searchFair = await this.dataSource.manager.findOne(Fair, {
        where: { id: fairId },
      });
  
      if (!searchFair || searchFair.isActive === false) {
        throw new NotFoundException("Feria inactiva");
      }
  
      const fairSeller = await this.dataSource.manager.findOne(
        SellerFairRegistration,
        {
          where: { seller, fair: searchFair },
          relations: ["categoryFair", "categoryFair.category"],
        }
      );
  
      if (!fairSeller) {
        throw new NotFoundException("Vendedor no registrado en la feria");
      }
  
      const foundCategory = await this.dataSource.manager.findOne(Category, {
        where: { id: fairSeller.categoryFair.category.id },
      });
  
      const fairCategory = await this.dataSource.manager.findOne(FairCategory, {
        where: { fair: searchFair, category: foundCategory },
      });
  
      if (!fairCategory) {
        throw new NotFoundException("Categoría de la feria no encontrada");
      }
  
      const liquidation = fairSeller.liquidation;
      const arrayProducts: Product[] = [];
  
      for (const product of products) {
        const productEntity = new Product();
        productEntity.brand = product.brand;
        productEntity.description = product.description;
        productEntity.price = product.price;
        productEntity.size = product.size;
        productEntity.liquidation = liquidation;
        productEntity.fairCategory = fairCategory;
        productEntity.seller = seller;
  
        const number = (seller.products?.length ?? 0) + arrayProducts.length + 1;
        productEntity.code = `${seller.sku}-${number}`;
  
        const savedProduct = await this.dataSource.manager.save(
          Product,
          productEntity
        );
  
        arrayProducts.push(savedProduct);
      }
  
      const productRequest = new ProductRequest();
      productRequest.seller = seller;
      productRequest.fair = searchFair;
      productRequest.status = StatusProductRequest.PENDING;
      productRequest.category = foundCategory.name;
      productRequest.products = arrayProducts;
  
      const newProductRequest = await this.dataSource.manager.save(
        ProductRequest,
        productRequest
      );
  
      await this.informAdminEmail(sellerId);
  
      return newProductRequest.id;
    } catch (error) {
      console.error("Error en createProducts:", error);
      throw new InternalServerErrorException("Error al crear productos.");
    }
  }
  

  async informAdminEmail(sellerId: string): Promise<void> {
  // Traemos el seller incluyendo su user
  const seller = await this.sellerRepository.findOne({
    where: { id: sellerId },
    relations: ['user'], // <-- IMPORTANTE
  });

  // Si no existe el seller, no enviamos mail
  if (!seller) {
    console.warn(`❗ No se envía email: seller ${sellerId} no encontrado`);
    return;
  }

  // Si no tiene user asociado, tampoco enviamos email
  if (!seller.user) {
    console.warn(`⚠ No se envía email: seller ${sellerId} no tiene usuario vinculado todavía.`);
    return;
  }

  // Nombre seguro (evita undefined)
  const sellerName = seller.user?.name ?? 'Vendedora sin nombre';

  const adminEmail = 'elplacarddemibebot@gmail.com'; 

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificación de productos enviados</title>
        <style>
          :root {
            --primary-default: #79bec1;
            --primary-light: #acdee0;
            --primary-lighter: #def5f6;
            --primary-dark: #4b979b;
            --primary-darker: #2f8083;
            --secondary-default: #ffe09f;
            --secondary-light: #ffecc3;
            --secondary-lighter: #fff7e6;
            --secondary-dark: #ffd47b;
            --secondary-darker: #d9ab4d;
          }

          body {
            font-family: Arial, sans-serif;
            background-color: var(--primary-lighter);
            margin: 0;
            padding: 0;
          }

          .container {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            border: 2px solid var(--secondary-default);
          }

          h1 {
            color: var(--primary-darker);
            text-align: center;
          }

          p {
            color: var(--primary-dark);
            line-height: 1.6;
          }

          .footer {
            text-align: center;
            margin-top: 20px;
            color: var(--primary-light);
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Notificación de productos enviados</h1>
          <p>¡Hola!</p>
          <p>La vendedora <strong>${sellerName}</strong> ha enviado sus productos para su evaluación y clasificación.</p>
          <p>Por favor, revisa los productos y asegúrate de que se ajusten a los requisitos de la feria.</p>
          <div class="footer">
            <p>EL PLAC FERIAS.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await this.mailService.sendMail({
      to: adminEmail,
      subject: 'Notificación de productos enviados por vendedora',
      html: htmlContent,
    });
  } catch (error) {
    throw new InternalServerErrorException(
      'Error al enviar el correo de notificación al administrador',
    );
  }
}

