import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { FairsService } from './fairs.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('fairs')
export class FairsController {
  constructor(private readonly fairsService: FairsService) {}

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteFair(@Param('id') id: string) {
    return this.fairsService.deleteFair(id);
  }
}