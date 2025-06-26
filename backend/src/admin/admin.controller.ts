import { Controller, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../users/roles/roles.decorator';
import { Role } from '../users/roles/roles.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Delete('cleanup')
  @Roles(Role.ADMIN)
  async cleanupOldData(): Promise<{ message: string }> {
    await this.adminService.cleanupOldData();
    return { message: 'Cleanup completed successfully.' };
  }
}