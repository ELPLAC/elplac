import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { Roles } from '@users/roles/roles.decorator';
import { Role } from '@users/roles/roles.enum';
import { RoleGuard } from '@users/roles/roles.guard';
import { SellerService } from '@sellers/seller.service';

@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async getAllSellers() {
    return await this.sellerService.getAllSellers();
  }

  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RoleGuard)
  @Post(':sellerId/register/:fairId/:fairCategoryId')
  async registerFair(
    @Param('sellerId') sellerId: string,
    @Param('fairId') fairId: string,
    @Param('fairCategoryId') fairCategoryId: string,
    @Body() body: { liquidation: string },
  ) {
    return await this.sellerService.registerFair(
      sellerId,
      fairId,
      fairCategoryId,
      body.liquidation,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('noactivate/:sellerId')
  async updateNoVerifySeller(@Param('sellerId') sellerId: string) {
    return await this.sellerService.updateNoVerifySeller(sellerId);
  }

  @UseGuards(AuthGuard)
  @Get(':sellerId')
  async getSellerById(@Param('sellerId') sellerId: string) {
    return await this.sellerService.getSellerById(sellerId);
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  async updateSeller(@Param('id') id: string, @Body() seller: any) {
    return await this.sellerService.updateSeller(id, seller);
  }

  @Post('informSellers')
async sendMailUpdateStatusProducts(@Body() body: { sellerIds: string[] }) {
  return await this.sellerService.sendMailUpdateStatusProducts(body.sellerIds);
}

}
