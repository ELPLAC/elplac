import { Injectable } from '@nestjs/common';
import { FairsRepository } from './fairs.repository';
import { FairDto } from './fairs.dto';

@Injectable()
export class FairsService {
  constructor(private readonly fairsRepository: FairsRepository) {}

  async createFair(fairDto: FairDto) {
    return this.fairsRepository.createFair(fairDto);
  }

  async getAllFairs() {
    return this.fairsRepository.getAllFairs();
  }

  async getFairById(fairId: string) {
    return this.fairsRepository.getFairById(fairId);
  }

  async closeFair(fairId: string) {
    return this.fairsRepository.closeFair(fairId);
  }

  async getProductsByIdAndFair(fairId: string, sellerId: string) {
    return this.fairsRepository.getProductsByIdAndFair(fairId, sellerId);
  }

  async editAddressFair(fairId: string, newAddressFair: Partial<FairDto>) {
    return this.fairsRepository.editAddressFair(fairId, newAddressFair);
  }

  async updateEntryPriceBuyer(fairId: string, entryPriceBuyer: string) {
    return this.fairsRepository.updateEntryPriceBuyer(fairId, entryPriceBuyer);
  }

  

  async getConcludedFairs() {
    return this.fairsRepository.getConcludedFairs();
  }

  async deleteFair(id: string) {
    return this.fairsRepository.deleteFair(id);
  }
}


