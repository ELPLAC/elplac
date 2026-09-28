import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
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

  // 🔴 Colocamos las rutas compuestas/específicas ANTES de la ruta genérica :id
  @Get('products/:sellerId/:fairId')
  async getProductsByIdAndFair(
    @Param('sellerId', new ParseUUIDPipe({ version: '4' })) sellerId: string,
    @Param('fairId', new ParseUUIDPipe({ version: '4' })) fairId: string,
  ) {
    return await this.fairsService.getProductsByIdAndFair(fairId, sellerId);
  }

  // Compatibilidad con la ruta anterior por si el frontend consume :sellerId/:fairId/productss
  @Get(':sellerId/:fairId/products')
  async getProductsByIdAndFairLegacy(
    @Param('sellerId', new ParseUUIDPipe({ version: '4' })) sellerId: string,
    @Param('fairId', new ParseUUIDPipe({ version: '4' })) fairId: string,
  ) {
    return await this.fairsService.getProductsByIdAndFair(fairId, sellerId);
  }

  @Get(':id')
  async getFairById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) fairId: string,
  ) {
    return await this.fairsService.getFairById(fairId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('close/:id')
  async closeFair(
    @Param('id', new ParseUUIDPipe({ version: '4' })) fairId: string,
  ) {
    return await this.fairsService.closeFair(fairId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('edit/:id')
  async editAddressFair(
    @Param('id', new ParseUUIDPipe({ version: '4' })) fairId: string,
    @Body() newAddressFair: Partial<FairDto>,
  ) {
    return await this.fairsService.editAddressFair(fairId, newAddressFair);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id/update-entry-price-buyer')
  async updateEntryPriceBuyer(
    @Param('id', new ParseUUIDPipe({ version: '4' })) fairId: string,
    @Body('entryPriceBuyer') entryPriceBuyer: string,
  ) {
    if (!entryPriceBuyer) {
      throw new BadRequestException('El precio de entrada es obligatorio.');
    }

    return this.fairsService.updateEntryPriceBuyer(fairId, entryPriceBuyer);
  }
}