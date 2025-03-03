import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@categories/categories.entity';
import { CategoriesController } from '@categories/categories.controller';
import { CategoriesRepository } from '@categories/categories.repository';
import { CategoriesService } from '@categories/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesRepository, CategoriesService],
  exports: [],
})
export class CategoriesModule implements OnModuleInit {
  private categories = [
    { name: 'Mujer 0 a 12 meses' },
    { name: 'Varón 0 a 12 meses' },
    { name: 'Varón +12 meses a 12 años' },
    { name: 'Mujer +12 meses a 12 años' },
    { name: 'Deco-Hogar' },
    { name: 'Vuelta al cole' },
    { name: 'Emprendedores' },
    { name: 'Otras' },
    { name: 'Adultos' },
    { name: 'Juguetes y libros' },
    { name: 'Juguetes, libros y agua' },
  ];
  constructor(private readonly categoriesService: CategoriesService) {}
  onModuleInit() {
    for (let i = 0; i < this.categories.length; i++) {
      this.categoriesService.createCategory(this.categories[i]);
    }
  }
}
