import { Body, Controller, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
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
}
