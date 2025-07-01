import { Injectable } from '@nestjs/common';
import { FairsRepository } from './fairs.repository';
import { FairDto } from './fairs.dto';

@Injectable()
export class FairsService {
  constructor(private readonly fairsRepository: FairsRepository) {}

  async createFair(fairDto: FairDto) {
    return await this.fairsRepository.createFair(fairDto);
  }

  async getAllFairs() {
    return await this.fairsRepository.getAllFairs();
  }

  async getFairById(fairId: string) {
    return await this.fairsRepository.getFairById(fairId);
  }

  async saveFair(fair: any) {
    return await this.fairsRepository.saveFair(fair);
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
    return await this.fairsRepository.updateEntryPriceBuyer(fairId, entryPriceBuyer);
  }

  // ✅ FUNCIONALIDAD CONCLUIR Y ELIMINAR
  async concludeAndDeleteFair(fairId: string) {
    await this.fairsRepository.closeFair(fairId);
    await this.fairsRepository.deleteProductsByFair(fairId);
    await this.fairsRepository.deleteTransactionsByFair(fairId);
    await this.fairsRepository.deleteSellerRegistrationsByFair(fairId);
    await this.fairsRepository.deleteFair(fairId);
    return { message: 'Feria concluida y eliminada correctamente' };
  }
}
