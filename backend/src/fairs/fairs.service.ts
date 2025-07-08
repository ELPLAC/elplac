import { Injectable } from '@nestjs/common';
import { FairDto } from '@fairs/fairs.dto';
import { FairsRepository } from '@fairs/fairs.repository';

@Injectable()
export class FairsService {
  constructor(private readonly fairsRepository: FairsRepository) {}

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

}
