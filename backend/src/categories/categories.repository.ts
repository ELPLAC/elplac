import { Injectable } from "@nestjs/common";
import { CategoryDto } from "@categories/categories.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "@categories/categories.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
    ) {}

    async createCategory(category: CategoryDto){
        const existingCategory = await this.categoriesRepository.findOne({where: {name: category.name}});
        if (existingCategory) return 'La categoria ya existe';
        const newCategory = this.categoriesRepository.create(category);
        await this.categoriesRepository.save(newCategory);
        return newCategory;
    }

    async getAllCategories() {
        return await this.categoriesRepository.find();
    }

    async getCategoryById(id: string) {
        const category = await this.categoriesRepository.findOne({where: {id: id}});
        if (!category) return 'La categoria no existe';
        return category
    }
}