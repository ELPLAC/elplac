import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FairsService } from './fairs.service';
import { FairDto } from './fairs.dto';

@Controller('fairs')
export class FairsController {
  constructor(private readonly fairsService: FairsService) {}

  @Post()
  async createFair(@Body() fairDto: FairDto) {
    return this.fairsService.createFair(fairDto);
  }

  @Get()
  async getAllFairs() {
    return this.fairsService.getAllFairs();
  }

  @Get(':id')
  async getFairById(@Param('id') id: string) {
    return this.fairsService.getFairById(id);
  }

  @Patch(':id/address')
  async updateAddress(
    @Param('id') id: string,
    @Body() body: Partial<FairDto>,
  ) {
    return this.fairsService.editAddressFair(id, body);
  }

  @Patch(':id/entry-price')
  async updateEntryPriceBuyer(
    @Param('id') id: string,
    @Body('entryPriceBuyer') entryPriceBuyer: string,
  ) {
    return this.fairsService.updateEntryPriceBuyer(id, entryPriceBuyer);
  }

  @Patch(':id/close')
  async closeFair(@Param('id') id: string) {
    return this.fairsService.closeFair(id);
  }

  @Patch(':id/soft-delete')
  async softDeleteFair(@Param('id') id: string) {
    return this.fairsService.softDeleteFair(id);
  }

  @Delete(':id/complete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFairCompletely(@Param('id') id: string) {
    await this.fairsService.deleteFairCompletely(id);
  }
}
