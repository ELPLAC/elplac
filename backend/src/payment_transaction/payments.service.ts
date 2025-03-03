import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { Fair } from '@fairs/entities/fairs.entity';
import { payment, preference } from '@config/mercadopago';
import { User } from '@users/users.entity';
import { UsersService } from '@users/users.service';
import { Seller } from '@sellers/sellers.entity';
import { SellerService } from '@sellers/seller.service';
import { PaymentTransaction } from '@payment_transaction/paymentTransaction.entity';
import { UserFairRegistration } from '@fairs/entities/userFairRegistration.entity';

dotenvConfig({ path: '.env' });

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentTransaction)
    readonly paymentRepository: Repository<PaymentTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Fair)
    private fairRepository: Repository<Fair>,
    private readonly userService: UsersService,
    @InjectRepository(Seller)
    readonly sellerRepository: Repository<Seller>,
    private readonly sellerService: SellerService,
    @InjectRepository(UserFairRegistration)
    private readonly userFairRegistrationRepository: Repository<UserFairRegistration>,
  ) {}

  async createPreferenceSeller(createPaymentDto: any, baseUrl: string) {
    const { userId, fairId, categoryId, liquidation } = createPaymentDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const fair = await this.fairRepository.findOne({
      where: { id: fairId, isActive: true },
    });
    if (!user || !fair) {
      throw new BadRequestException('Seller or Fair not found');
    }

    const preferenceData = {
      items: [
        {
          id: fair.id,
          category_id: categoryId,
          title: fair.name,
          quantity: 1,
          unit_price: fair.entryPriceSeller,
        },
      ],
      notification_url: `elplac-production-3a9f.up.railway.app/payments/success/seller/?fairId=${fairId}&userId=${userId}&categoryId=${categoryId}&liquidation=${liquidation}`,
      back_urls: {
        success: `https://elplac-ruby.vercel.app//dashboard/fairs`,
      },
      auto_return: 'approved',
    };

    try {
      const response = await preference.create({ body: preferenceData });
      return { preferenceId: response.id };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async handlePaymentSuccessSeller(data: any) {
    try {
      const fair = await this.fairRepository.findOne({
        where: { id: data.fairId, isActive: true },
      });
      const user = await this.userRepository.findOne({
        where: { id: data.userId },
        relations: { seller: true },
      });
      const seller = user?.seller;

      if (!fair || !user || !seller) {
        throw new BadRequestException('Datos inválidos para la inscripción');
      }

      const paymentId = data['data.id'] || data['id'];
      const newPayment = await payment.get({ id: paymentId });

      if (
        newPayment.status_detail === 'accredited' ||
        newPayment.status_detail === 'approved'
      ) {
        await this.paymentRepository.save({
          fair,
          user,
          amount: fair.entryPriceSeller,
          transactionDate: new Date(),
          transactionType: 'Inscripción',
        });

        await this.sellerService.registerFair(
          seller.id,
          data.fairId,
          data.categoryId,
          data.liquidation,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al manejar el pago exitoso',
      );
    }
  }

  async createPreferenceBuyer(createPaymentDto: any) {
    const { userId, fairId, registrationHour, registrationDay } =
      createPaymentDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const fair = await this.fairRepository.findOne({
      where: { id: fairId, isActive: true },
    });

    if (!user || !fair) {
      throw new BadRequestException('Seller or Fair not found');
    }

    const preferenceData = {
      items: [
        {
          id: fair.id,
          title: fair.name,
          quantity: 1,
          unit_price: fair.entryPriceBuyer,
        },
      ],
      notification_url: `elplac-production-3a9f.up.railway.app/payments/success/buyer/?selectedHour=${registrationHour}&selectedDay=${registrationDay}&fairId=${fairId}&userId=${user.id}`,
      back_urls: {
        success: `https://elplac-ruby.vercel.app//dashboard/profile`,
      },
      auto_return: 'approved',
    };

    try {
      const response = await preference.create({ body: preferenceData });
      return { preferenceId: response.id };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async handlePaymentSuccessBuyer(data: any) {
    try {
      const fair = await this.fairRepository.findOne({
        where: { id: data.fairId, isActive: true },
      });
      const user = await this.userRepository.findOne({
        where: { id: data.userId },
      });

      const userRegistered = await this.userFairRegistrationRepository.findOne({
        where: {
          fair: fair,
          user: user,
        },
      });
      const paymentRegistered = await this.paymentRepository.findOne({
        where: {
          fair: fair,
          user: user,
        },
      });

      if (paymentRegistered) {
        throw new BadRequestException('Payment already registered');
      }
      if (userRegistered) {
        throw new BadRequestException('User already registered');
      }

      const newPayment = await payment.get({ id: data.dataId });
      if (newPayment.status_detail === 'accredited') {
        const transactions = new PaymentTransaction();
        transactions.fair = fair;
        transactions.user = user;
        transactions.amount = fair.entryPriceBuyer;
        transactions.transactionDate = new Date();
        transactions.transactionType = 'Inscripción';

        await this.paymentRepository.save(transactions);
        await this.userService.registerUserFair(fair.id, user.id, {
          selectedHour: data.selectedHour,
          selectedDay: data.selectedDay,
        });

        return { message: 'Payment successful' };
      }

      return { message: 'Payment failed' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
