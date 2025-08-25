import { CategoryController } from "@/Controller/CategoryController"
import type { Category } from "@/Model/Category"

export class CategoryService {
  private categoryController: CategoryController

  constructor() {
    this.categoryController = new CategoryController()
  }

  public async getCategories(): Promise<Category[]> {
    return await this.categoryController.getCategories()
  }

  public async getCategoryById(id: string): Promise<Category | null> {
    return await this.categoryController.getCategoryById(id)
  }

  public async getFeaturedCategories(): Promise<Category[]> {
    return await this.categoryController.getFeaturedCategories()
  }
}
