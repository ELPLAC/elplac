import { Injectable } from "@nestjs/common";
import { CategoryDto } from "@categories/categories.dto";
import { CategoriesRepository } from "@categories/categories.repository";

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) {}

    async createCategory(category: CategoryDto){
        return await this.categoriesRepository.createCategory(category);
    }

    async getAllCategories() {
        return await this.categoriesRepository.getAllCategories();
    }

    async getCategoryById(id : string){
        return await this.categoriesRepository.getCategoryById(id);
    }
}