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
}
