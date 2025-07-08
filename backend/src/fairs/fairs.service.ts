// src/fairs/fairs.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FairDto } from '@fairs/fairs.dto';
import { FairsRepository } from '@fairs/fairs.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    @InjectDataSource() private dataSource: DataSource,
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

  async closeFair(fairId: string){
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

  // --- ESTA ES LA FUNCIÓN MODIFICADA PARA ELIMINAR LA FERIA ACTIVA ---
  async concludeAndDeleteActiveFair() { // <-- Ya NO espera un fairId aquí
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Encontrar la feria ACTIVA para eliminar
      const activeFair = await queryRunner.manager.findOne(Fair, {
        where: { isActive: true }, // <-- Busca la feria con isActive: true
        relations: {
          fairDays: true,
          buyerCapacities: true,
          fairCategories: {
            products: true
          },
          productRequests: true,
          transactions: true,
          userRegistrations: true,
          sellerRegistrations: true
        }
      });

      if (!activeFair) {
        throw new NotFoundException('No se encontró ninguna feria activa para eliminar.');
      }

      const fairId = activeFair.id; // Obtener el ID de la feria activa encontrada

      // 2. Eliminar todas las entidades relacionadas en cascada (¡el orden es importante!)
      // Elimina las relaciones ManyToOne/OneToOne primero, luego las OneToMany si no están en cascada
      await queryRunner.manager.delete(BuyerCapacity, { fair: { id: fairId } });
      await queryRunner.manager.delete(FairDay, { fair: { id: fairId } });
      await queryRunner.manager.delete(ProductRequest, { fair: { id: fairId } });
      await queryRunner.manager.delete(PaymentTransaction, { fair: { id: fairId } });

      // Eliminar Product (Confirmado que se eliminan, a través de FairCategory)
      if (activeFair.fairCategories && activeFair.fairCategories.length > 0) {
        for (const fairCategory of activeFair.fairCategories) {
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