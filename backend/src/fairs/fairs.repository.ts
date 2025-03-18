import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fair } from '@fairs/entities/fairs.entity';
import { Repository } from 'typeorm';
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
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createFair(fairDto: FairDto) {
    const fair = new Fair();
    fair.name = fairDto.name;
    fair.address = fairDto.address;
    fair.entryPriceSeller = fairDto.entryPriceSeller;
    fair.entryPriceBuyer = fairDto.entryPriceBuyer.toString();
    fair.entryDescription = fairDto.entryDescription;

    const savedFair = await this.fairRepository.save(fair);

    if (fairDto.fairCategories) {
      const fairCategories = await Promise.all(
        fairDto.fairCategories.map(async (fairCategoryDto) => {
          const fairCategory = new FairCategory();
          fairCategory.maxProductsSeller = fairCategoryDto.maxProductsSeller;
          fairCategory.minProductsSeller = fairCategoryDto.minProductsSeller;
          fairCategory.maxSellers = fairCategoryDto.maxSellers;
          fairCategory.maxProducts = fairCategoryDto.maxProducts;
          fairCategory.fair = savedFair;
          fairCategory.products = [];

          if (fairCategoryDto.category) {
            const category = await this.categoryRepository.findOneBy({
              name: fairCategoryDto.category.name,
            });
            if (!category) {
              throw new NotFoundException(
                `La categoría ${fairCategoryDto.category.name} no existe`,
              );
            }
            fairCategory.category = category;
          } else {
            throw new BadRequestException(
              'La categoría no tiene nombre o no está definida correctamente',
            );
          }
          return this.fairCategoryRepository.save(fairCategory);
        }),
      );
      savedFair.fairCategories = fairCategories;
    }

    if (fairDto.fairDays) {
      const fairDays = await Promise.all(
        fairDto.fairDays.map(async (fairDayDto) => {
          const fairDay = new FairDay();
          fairDay.day = new Date(fairDayDto.day);
          fairDay.fair = savedFair;
          fairDay.isClosed = fairDayDto.isClosed;

          if (!fairDayDto.isClosed) {
            if (!fairDayDto.startTime || !fairDayDto.endTime) {
              throw new BadRequestException(
                `El día ${fairDayDto.day} debe tener horario de inicio y fin si no está marcado como cerrado`,
              );
            }
            const startTime = parseISO(
              `1970-01-01T${fairDayDto.startTime}:00Z`,
            );
            const endTime = parseISO(`1970-01-01T${fairDayDto.endTime}:00Z`);

            fairDay.startTime = startTime.toISOString().substr(11, 5);
            fairDay.endTime = endTime.toISOString().substr(11, 5);
          }

          const savedFairDay = await this.fairDayRepository.save(fairDay);

          if (!fairDayDto.isClosed) {
            const startTime = parseISO(
              `1970-01-01T${fairDayDto.startTime}:00Z`,
            );
            const endTime = parseISO(`1970-01-01T${fairDayDto.endTime}:00Z`);
            const interval = fairDayDto.timeSlotInterval ?? 60;
            const capacity = fairDayDto.capacityPerTimeSlot ?? 10;

            const buyerCapacities = [];
            for (
              let time = startTime;
              time < endTime;
              time = addMinutes(time, interval)
            ) {
              const buyerCapacity = new BuyerCapacity();
              buyerCapacity.hour = time.toISOString().substr(11, 5);
              buyerCapacity.capacity = capacity;
              buyerCapacity.fairDay = savedFairDay;
              buyerCapacities.push(
                await this.buyerCapacityRepository.save(buyerCapacity),
              );
            }
            savedFairDay.buyerCapacities = buyerCapacities;
          }
          return savedFairDay;
        }),
      );
      savedFair.fairDays = fairDays;
    }
    return await this.getFairById(savedFair.id);
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
    const fair = await this.fairRepository.findOne({
      where: { id: fairId },
      relations: [
        'fairDays',
        'fairDays.buyerCapacities',
        'userRegistrations',
        'sellerRegistrations.categoryFair.category',
        'sellerRegistrations.seller.user',
        'fairCategories.category',
        'fairCategories.products',
        'productRequests',
      ],
      select: {
        id: true,
        name: true,
        address: true,
        entryPriceSeller: true,
        entryPriceBuyer: true,
        isActive: true,
        entryDescription: true,
        fairDays: {
          id: true,
          day: true,
          startTime: true,
          endTime: true,
          isClosed: true,
          buyerCapacities: {
            id: true,
            hour: true,
            capacity: true,
          },
        },
        userRegistrations: {
          id: true,
          registrationDate: true,
          entryFee: true,
          registrationDay: true,
          registrationHour: true,
          user: {
            id: true,
            email: true,
            name: true,
            lastname: true,
            dni: true,
            role: true,
            statusGeneral: true,
          },
        },
        sellerRegistrations: {
          id: true,
          registrationDate: true,
          entryFee: true,
          liquidation: true,
          seller: {
            id: true,
            status: true,
            user: {
              id: true,
              name: true,
              email: true,
            },
          },
          categoryFair: {
            id: true,
            maxProducts: true,
            minProductsSeller: true,
            maxProductsSeller: true,
            maxSellers: true,
            products: {
              id: true,
              brand: true,
              status: true,
              price: true,
              description: true,
            },
            category: {
              id: true,
              name: true,
            },
          },
        },
        fairCategories: {
          id: true,
          maxProducts: true,
          minProductsSeller: true,
          maxProductsSeller: true,
          maxSellers: true,
          products: {
            id: true,
            brand: true,
            status: true,
            price: true,
            description: true,
          },
          category: {
            id: true,
            name: true,
          },
        },
        productRequests: {
          id: true,
          status: true,
        },
      },
    });
    if (!fair) throw new NotFoundException('Feria no encontrada');
    return fair;
  }

  async saveFair(fair: Fair) {
    return await this.fairRepository.save(fair);
  }

  async closeFair(fairId: string) {
    const fairToClose = await this.fairRepository.findOne({
      where: { id: fairId },
      relations: {
        userRegistrations: { user: true },
        sellerRegistrations: { seller: { user: true } },
      },
    });
    if (!fairToClose) throw new NotFoundException('Feria no encontrada');

    const usersToUpdate = fairToClose.userRegistrations
      .filter((reg) => reg.user)
      .map((reg) => {
        reg.user.statusGeneral = UserStatusGeneral.INACTIVE;
        return reg.user;
      });

    await this.userRepository.save(usersToUpdate);

    const sellersToUpdate = fairToClose.sellerRegistrations
      .filter((reg) => reg.seller && reg.seller.user)
      .map((reg) => {
        reg.seller.status = SellerStatus.NO_ACTIVE;
        reg.seller.user.statusGeneral = UserStatusGeneral.INACTIVE;
        return reg.seller;
      });

    await this.sellerRepository.save(sellersToUpdate);
    await this.userRepository.save(sellersToUpdate.map((s) => s.user));

    fairToClose.isActive = false;
    await this.fairRepository.save(fairToClose);
    return { message: 'Feria cerrada correctamente', fairToClose };
  }

  async getProductsByIdAndFair(fairId: string, sellerId: string) {
    const fair = await this.fairRepository.findOne({
      where: { id: fairId },
      relations: {
        fairCategories: {
          products: {
            seller: true
          }
        }
      }
    });
  
    if (!fair) {
      throw new NotFoundException('Feria no encontrada');
    }
  
    const fairCategories = Array.isArray(fair.fairCategories) 
      ? fair.fairCategories 
      : [fair.fairCategories];
  
    const products = fairCategories.flatMap(fc =>
      fc.products.filter(product => product.seller.id === sellerId)
    );
  
    return products.map(product => ({
      id: product.id,
      brand: product.brand,
      status: product.status,
      price: product.price,
      description: product.description,
    }));
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
  
    if (!fair) {
      throw new NotFoundException('Feria no encontrada');
    }
  
    fair.entryPriceBuyer = entryPriceBuyer;
    await this.fairRepository.save(fair);
  
    return { message: 'Precio de entrada actualizado correctamente', fair };
  }

  async toggleUserVisibility(fairId: string) {
    const fair = await this.fairRepository.findOneBy({ id: fairId });

    if (!fair) {
      throw new NotFoundException('Feria no encontrada');
    }

    fair.isVisibleUser = !fair.isVisibleUser;
    await this.fairRepository.save(fair);

    return {
      message: `Visibilidad de formulario cambiada a ${fair.isVisibleUser}`,
      fair: await this.getFairById(fairId),
    };
  }
}
