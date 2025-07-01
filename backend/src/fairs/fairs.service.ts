import { Injectable, NotFoundException } from '@nestjs/common';
import { FairsRepository } from './fairs.repository';
import { FairDto } from './fairs.dto';
import { Fair } from './entities/fairs.entity';

@Injectable()
export class FairsService {
  constructor(private readonly fairsRepository: FairsRepository) {}

  async createFair(fairDto: FairDto): Promise<Fair> {
    return this.fairsRepository.createFair(fairDto);
  }

  async getAllFairs(): Promise<Fair[]> {
    return this.fairsRepository.getAllFairs();
  }

  async getFairById(fairId: string): Promise<Partial<Fair>> {
    return this.fairsRepository.getFairById(fairId);
  }

  async editAddressFair(fairId: string, data: Partial<FairDto>) {
    return this.fairsRepository.editAddressFair(fairId, data);
  }

  async updateEntryPriceBuyer(fairId: string, price: string) {
    return this.fairsRepository.updateEntryPriceBuyer(fairId, price);
  }

  async closeFair(fairId: string) {
    return this.fairsRepository.closeFair(fairId);
  }

  async softDeleteFair(fairId: string) {
    const fair = await this.fairsRepository.findOne({ where: { id: fairId } });

    if (!fair) {
      throw new NotFoundException('Feria no encontrada');
    }

    fair.isActive = false;

    await this.fairsRepository.save(fair);

    return {
      message: 'Feria desactivada correctamente',
      fair,
    };
  }

  async deleteFairCompletely(fairId: string) {
    await this.fairsRepository.deleteProductsByFair(fairId);
    await this.fairsRepository.deleteTransactionsByFair(fairId);
    await this.fairsRepository.deleteSellerRegistrationsByFair(fairId);
    await this.fairsRepository.deleteFair(fairId);

    return { message: 'Feria eliminada completamente del sistema' };
  }
}

