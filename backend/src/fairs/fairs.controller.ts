import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { FairsService } from './fairs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('fairs')
export class FairsController {
  constructor(private readonly fairsService: FairsService) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteFair(@Param('id') id: string) {
    return this.fairsService.deleteFair(id);
  }
}