
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FairsService } from './fairs.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('fairs')
export class FairsController {
  constructor(private readonly fairsService: FairsService) {}

  @Put(':id/update-entry-price-buyer')
  async updateEntryPriceBuyer(
    @Param('id') fairId: string,
    @Body('entryPriceBuyer') entryPriceBuyer: number,
  ) {
    return this.fairsService.updateEntryPriceBuyer(fairId, entryPriceBuyer);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteFair(@Param('id') id: string) {
    return this.fairsService.concludeAndDeleteFair(id);
  }
}
