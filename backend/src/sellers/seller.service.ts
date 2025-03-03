import { Injectable } from '@nestjs/common';
import { SellerRepository } from '@sellers/sellers.repository';

@Injectable()
export class SellerService {
  constructor(private readonly sellerRepository: SellerRepository) {}

  async registerFair(
    sellerId: string,
    fairId: string,
    fairCategoryId: string,
    liquidation: string,
  ) {
    return await this.sellerRepository.registerFair(
      sellerId,
      fairId,
      fairCategoryId,
      liquidation,
    );
  }

  async updateNoVerifySeller(sellerId: string) {
    return await this.sellerRepository.updateNoVerifySeller(sellerId);
  }

  async getSellerById(sellerId: string) {
    return await this.sellerRepository.getSellerByIdWithProducts(sellerId);
  }

  async getAllSellers() {
    return await this.sellerRepository.getAllSellers();
  }
  async updateSeller(id: string, seller: any) {
    return await this.sellerRepository.updateSeller(id, seller);
  }

  async sendMailUpdateStatusProducts(sellerId: string[]) {
    return await this.sellerRepository.sendMailUpdateStatusProducts(sellerId);
  }
}
