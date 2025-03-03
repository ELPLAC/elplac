import { Controller, Post, Body, Get, Query, Req, Res } from '@nestjs/common';
import { PaymentsService } from '@payment_transaction/payments.service';
import { Request } from 'express';
import axios from 'axios';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly mercadoPagoService: PaymentsService) {}

  @Post('createPreferenceSeller')
  async createPaymentSeller(
    @Req() req: Request,
    @Body() createPaymentDto: any,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.mercadoPagoService.createPreferenceSeller(createPaymentDto, baseUrl);
  }

  @Post('createPreferenceBuyer')
  async createPaymentBuyer(@Body() createPaymentDto: any) {
    return this.mercadoPagoService.createPreferenceBuyer(createPaymentDto);
  }

  @Post('success/buyer')
  async paymentSuccessBuyer(
    @Query() query: Record<string, string | Date>,
    @Res() res,
  ) {
    const { id, dataId, fairId, selectedHour, selectedDay, userId } = query;
    const data = { id, dataId, fairId, selectedHour, selectedDay, userId };

    try {
      await this.mercadoPagoService.handlePaymentSuccessBuyer(data);
      res.redirect(`${process.env.FRONTEND_URL}/payment/success/Pago exitoso`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/payment/failure`);
    }
  }

  @Post('success/seller')
  async paymentSuccessSeller(
    @Query() query: Record<string, string | Date>,
    @Res() res,
  ) {
    const { fairId, userId, categoryId, liquidation, id, dataId } = query;
    const data = { id, dataId, fairId, categoryId, userId, liquidation };

    try {
      await this.mercadoPagoService.handlePaymentSuccessSeller(data);
      res.redirect(`${process.env.FRONTEND_URL}/payment/success/Pago exitoso`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/payment/failure`);
    }
  }

  @Get('failure')
  paymentFailure() {
    return { message: 'Payment failed' };
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res) {
    const accessTokenUrl = 'https://api.mercadopago.com/v1/oauth/token';
    const { MP_CLIENT_ID: clientId, MP_CLIENT_SECRET: clientSecret } = process.env;

    try {
      const response = await axios.post(accessTokenUrl, null, {
        params: {
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
        },
      });

      const { access_token } = response.data;
      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}`);
    }
  }
}
