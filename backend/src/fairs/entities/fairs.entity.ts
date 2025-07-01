import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fair } from '@fairs/entities/fairs.entity';
import { Repository, DataSource, FindOneOptions } from 'typeorm';
import { FairDto } from '@fairs/fairs.dto';
import { BuyerCapacity } from '@fairs/entities/buyersCapacity.entity';
import { FairDay } from '@fairs/entities/fairDay.entity';
import { Category } from '@categories/categories.entity';
import { FairCategory } from '@fairs/entities/fairCategory.entity';
import { UserStatusGeneral } from '@users/users.enum';
import { SellerStatus } from '@sellers/sellers.enum';
import { addMinutes, parseISO } from 'date-fns';
import { Seller } from '@sellers/sellers.entity';
import { User } from '@users/users.entity';

@Injectable()
export class FairsRepository {
  constructor(
    @InjectRepository(Fair)
    private readonly fairRepository: Repository<Fair>,
    @InjectRepository(BuyerCapacity)
    private readonly buyerCapacityRepository: Repository<BuyerCapacity>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(FairDay)
    private readonly fairDayRepository: Repository<FairDay>,
    @InjectRepository(FairCategory)
    private readonly fairCategoryRepository: Repository<FairCategory>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findOne(options: FindOneOptions<Fair>): Promise<Fair | null> {
    return this.fairRepository.findOne(options);
  }

  async save(fair: Fair): Promise<Fair> {
    return this.fairRepository.save(fair);
  }

  async createFair(fairDto: FairDto) {
    // ... tu código actual de createFair sin cambios ...
  }

  async getAllFairs(): Promise<Fair[]> {
    return await this.fairRepository.find({
      relations: [
        'fairDays',
        'fairDays.buyerCapacities',
        'userRegistrations',
        'sellerRegistrations',
        'sellerRegistrations.categoryFair.category',
        'sellerRegistrations.seller',
        'fairCategories',
        'fairCategories.category',
        'fairCategories.products',
        'sellerRegistrations.seller.user',
      ],
    });
  }

  async getFairById(fairId: string): Promise<Partial<Fair>> {
    // ... tu código actual de getFairById sin cambios ...
  }

  async closeFair(fairId: string) {
    // ... tu código actual de closeFair sin cambios ...
  }

  async getProductsByIdAndFair(fairId: string, sellerId: string) {
    // ... tu código actual de getProductsByIdAndFair sin cambios ...
  }

  async editAddressFair(fairId: string, newAddressFair: Partial<FairDto>) {
    const fairToEdit = await this.fairRepository.findOneBy({ id: fairId });
    if (!fairToEdit) throw new NotFoundException('Feria no encontrada');
    if (newAddressFair.address) {
      fairToEdit.address = newAddressFair.address;
    }
    return await this.fairRepository.save(fairToEdit);
  }

  async updateEntryPriceBuyer(fairId: string, entryPriceBuyer: string) {
    const fair = await this.fairRepository.findOne({ where: { id: fairId } });
    if (!fair) throw new NotFoundException('Feria no encontrada');
    fair.entryPriceBuyer = entryPriceBuyer;
    await this.fairRepository.save(fair);
    return { message: 'Precio de entrada actualizado correctamente', fair };
  }

  async deleteProductsByFair(fairId: string) {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('product_request')
      .where('fairId = :fairId', { fairId })
      .execute();
  }

  async deleteTransactionsByFair(fairId: string) {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('payment_transaction')
      .where('fairId = :fairId', { fairId })
      .execute();
  }

  async deleteSellerRegistrationsByFair(fairId: string) {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('seller_fair_registration')
      .where('fairId = :fairId', { fairId })
      .execute();
  }

  async deleteFair(fairId: string) {
    await this.fairRepository.delete({ id: fairId });
  }
}
