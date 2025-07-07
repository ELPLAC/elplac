import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FairDto } from '@fairs/fairs.dto';
import { FairsRepository } from '@fairs/fairs.repository';
import { DataSource } from 'typeorm';
import { Fair } from '@fairs/entities/fairs.entity';

@Injectable()
export class FairsService {
  constructor(
    private readonly fairsRepository: FairsRepository,
    private readonly dataSource: DataSource,
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

  async editAddressFair(
    fairId: string,
    newAddressFair: Partial<FairDto>,
  ) {
    return await this.fairsRepository.editAddressFair(fairId, newAddressFair);
  }

  async updateEntryPriceBuyer(fairId: string, entryPriceBuyer: string) {
    return this.fairsRepository.updateEntryPriceBuyer(
      fairId,
      entryPriceBuyer,
    );
  }

  async deleteFair(fairId: string, adminId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fair = await queryRunner.manager.findOne(Fair, {
        where: { id: fairId },
        relations: [
          'productRequests',
          'sellerRegistrations',
          'userRegistrations',
          'fairDays',
          'transactions',
          'fairCategories',
        ],
      });

      if (!fair) {
        throw new NotFoundException('Feria no encontrada');
      }

      await queryRunner.manager.delete('product_request', {
        fair: { id: fairId },
      });
      await queryRunner.manager.delete('seller_fair_registration', {
        fair: { id: fairId },
      });
      await queryRunner.manager.delete('user_fair_registration', {
        fair: { id: fairId },
      });
      await queryRunner.manager.delete('fair_day', {
        fair: { id: fairId },
      });
      await queryRunner.manager.delete('payment_transaction', {
        fair: { id: fairId },
      });
      await queryRunner.manager.delete('fair_category', {
        fair: { id: fairId },
      });

      await queryRunner.manager.delete(Fair, { id: fairId });

      await queryRunner.commitTransaction();

      console.log(
        `Admin ${adminId} eliminó feria ${fairId} a las ${new Date().toISOString()}`,
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error al concluir la feria');
    } finally {
      await queryRunner.release();
    }
  }
}

