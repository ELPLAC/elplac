import {
  Controller,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  Role,
} from '../auth/auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Delete('cleanup')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cleanOldData(): Promise<void> {
    await this.adminService.cleanOldData();
  }
}
