import { CategoryModel, type Category } from "@/Model/Category"

export class CategoryController {
  private categoryModel: CategoryModel

  constructor() {
    this.categoryModel = CategoryModel.getInstance()
  }

  public async getCategories(): Promise<Category[]> {
    return await this.categoryModel.findAll()
  }

  public async getCategoryById(id: string): Promise<Category | null> {
    return await this.categoryModel.findById(id)
  }

  public async getFeaturedCategories(): Promise<Category[]> {
    return await this.categoryModel.findFeatured()
  }
}
