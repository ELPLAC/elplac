// src/fairs/fairs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { FairDto } from '@fairs/fairs.dto';
import { FairsRepository } from '@fairs/fairs.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm'; // Asegúrate de importar Repository si lo usas directamente
import { Fair } from './entities/fairs.entity';

// Importa TODAS las entidades relacionadas que vas a eliminar o actualizar.
// Asegúrate de que las rutas de importación sean correctas para tu proyecto.
import { FairDay } from './entities/fairDay.entity';
import { BuyerCapacity } from './entities/buyersCapacity.entity';
import { FairCategory } from './entities/fairCategory.entity';
import { ProductRequest } from '../products/entities/productRequest.entity'; // Ajusta la ruta si es diferente
import { PaymentTransaction } from '../payment_transaction/paymentTransaction.entity'; // Ajusta la ruta si es diferente
import { UserFairRegistration } from './entities/userFairRegistration.entity';
import { SellerFairRegistration } from './entities/sellerFairRegistration.entity';
import { Product } from '../products/entities/products.entity'; // Ajusta la ruta si es diferente

@Injectable()
export class FairsService {
  constructor(
    private readonly fairsRepository: FairsRepository,
    @InjectDataSource() private dataSource: DataSource, // Inyectar DataSource para transacciones
    // Si necesitas acceder directamente a los repositorios para delete en FairService, inyecta aquí.
    // Aunque con queryRunner.manager.delete() y TypeORM cargando las relaciones, no siempre es necesario inyectar todos los repositorios.
    // @InjectRepository(Product) private productsRepository: Repository<Product>,
    // @InjectRepository(PaymentTransaction) private paymentTransactionsRepository: Repository<PaymentTransaction>,
    // etc.
  ) {}

  async createFair(fair: FairDto) {
    return await this.fairsRepository.createFair(fair);
  }

  async getAllFairs() {
    return await this.fairsRepository.getAllFairs();
  }

  async getFairById(fairId: string) {
    return await this.fairsRepository.getFairById(fairId);
  }

  async closeFair(fairId: string) {
    return await this.fairsRepository.closeFair(fairId);
  }

  async getProductsByIdAndFair(fairId: string, sellerId: string) {
    return await this.fairsRepository.getProductsByIdAndFair(fairId, sellerId);
  }

  async editAddressFair(fairId: string, newAddressFair: Partial<FairDto>) {
    return await this.fairsRepository.editAddressFair(fairId, newAddressFair);
  }

  async updateEntryPriceBuyer(fairId: string, entryPriceBuyer: string) {
    return this.fairsRepository.updateEntryPriceBuyer(fairId, entryPriceBuyer);
  }

  /**
   * Concluye la feria activa y elimina todos sus datos relacionados confirmados.
   * Esta operación es transaccional para asegurar la integridad de los datos.
   */
  async concludeAndDeleteActiveFair(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Encontrar la feria activa con sus relaciones para una eliminación efectiva.
      const activeFair = await queryRunner.manager.findOne(Fair, {
        where: { isActive: true },
        relations: [
          'fairDays',
          'fairDays.buyerCapacities', // Para eliminar BuyerCapacity
          'fairCategories',
          'fairCategories.products', // Para eliminar Products
          'productRequests', // Para eliminar ProductRequest
          'transactions', // Para eliminar PaymentTransaction
          'userRegistrations', // Para eliminar UserFairRegistration
          'sellerRegistrations', // Para eliminar SellerFairRegistration
        ],
      });

      if (!activeFair) {
        throw new NotFoundException('No hay una feria activa para concluir y eliminar.');
      }

      const fairId = activeFair.id;

      // 2. Eliminar datos relacionados en el orden correcto (hijos antes que padres).

      // Eliminar BuyerCapacity (hijos de FairDay)
      if (activeFair.fairDays && activeFair.fairDays.length > 0) {
        for (const fairDay of activeFair.fairDays) {
          await queryRunner.manager.delete(BuyerCapacity, { fairDay: { id: fairDay.id } });
        }
      }

      // Eliminar FairDay
      await queryRunner.manager.delete(FairDay, { fair: { id: fairId } });

      // Eliminar ProductRequest
      await queryRunner.manager.delete(ProductRequest, { fair: { id: fairId } });

      // Eliminar PaymentTransaction (Confirmado que se eliminan)
      await queryRunner.manager.delete(PaymentTransaction, { fair: { id: fairId } });

      // Eliminar Product (Confirmado que se eliminan, a través de FairCategory)
      if (activeFair.fairCategories && activeFair.fairCategories.length > 0) {
        for (const fairCategory of activeFair.fairCategories) {
          // Asegúrate de que fairCategory.products sea un array y no nulo
          if (Array.isArray(fairCategory.products) && fairCategory.products.length > 0) {
            for (const product of fairCategory.products) {
              await queryRunner.manager.delete(Product, { id: product.id });
            }
          }
        }
      }

      // Eliminar FairCategory
      await queryRunner.manager.delete(FairCategory, { fair: { id: fairId } });

      // Eliminar UserFairRegistration
      await queryRunner.manager.delete(UserFairRegistration, { fair: { id: fairId } });

      // Eliminar SellerFairRegistration
      await queryRunner.manager.delete(SellerFairRegistration, { fair: { id: fairId } });

      // 3. Finalmente, eliminar la entidad Fair principal
      await queryRunner.manager.remove(activeFair);

      await queryRunner.commitTransaction(); // Confirmar la transacción
    } catch (err) {
      await queryRunner.rollbackTransaction(); // Revertir si hay cualquier error
      console.error('Error durante la transacción de eliminación de feria:', err);
      throw err; // Relanzar el error para que el controlador lo maneje
    } finally {
      await queryRunner.release(); // Liberar el query runner
    }
  }
}