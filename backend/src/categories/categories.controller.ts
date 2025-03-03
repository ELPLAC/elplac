import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from '@categories/categories.service';
import { AuthGuard } from '@auth/auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return await this.categoriesService.getCategoryById(id);
  }
}
