import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FairsService } from '@fairs/fairs.service';
import { FairDto } from '@fairs/fairs.dto';
import { AuthGuard } from '@auth/auth.guard';
import { RoleGuard } from '@users/roles/roles.guard';
import { Roles } from '@users/roles/roles.decorator';
import { Role } from '@users/roles/roles.enum';

@Controller('fairs')
export class FairsController {
  constructor(private readonly fairsService: FairsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  async createFair(@Body() fair: FairDto) {
    return await this.fairsService.createFair(fair);
  }

  @Get()
  async getAllFairs() {
    return await this.fairsService.getAllFairs();
  }

  @Get(':id')
  async getFairById(@Param('id') fairId: string) {
    return await this.fairsService.getFairById(fairId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('close/:id')
  async closeFair(@Param('id') fairId: string) {
    return await this.fairsService.closeFair(fairId);
  }

  @Get(':sellerId/:fairId/products')
  async getProductsByIdAndFair(
    @Param('sellerId') sellerId: string,
    @Param('fairId') fairId: string,
  ) {
    return await this.fairsService.getProductsByIdAndFair(fairId, sellerId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('edit/:id')
  async editAddressFair(
    @Param('id') fairId: string,
    @Body() newAddressFair: Partial<FairDto>,
  ) {
    return await this.fairsService.editAddressFair(fairId, newAddressFair);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id/update-entry-price-buyer')
  async updateEntryPriceBuyer(
    @Param('id') fairId: string,
    @Body('entryPriceBuyer') entryPriceBuyer: string,
  ) {
    if (!entryPriceBuyer) {
      throw new BadRequestException('El precio de entrada es obligatorio.');
    }

    return this.fairsService.updateEntryPriceBuyer(fairId, entryPriceBuyer);
  }

  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('conclude/:id')
  async concludeAndDeleteFair(@Param('id') fairId: string) {
    return await this.fairsService.concludeAndDeleteFair(fairId);
  }
}



@Get('history')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
getConcludedFairs() {
  return this.fairsService.getConcludedFairs();
}

@Delete('history/:id')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
deleteConcludedFair(@Param('id') fairId: string) {
  return this.fairsService.deleteFair(fairId);

@Get('history')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  getConcludedFairs() {
    return this.fairsService.getConcludedFairs();
  }

  @Delete('history/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  deleteConcludedFair(@Param('id') fairId: string) {
    return this.fairsService.deleteFair(fairId);
  }
}
