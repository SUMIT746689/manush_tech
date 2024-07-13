import { Category } from "./category";


export interface FoodItem {
  id: number;
  name: string;
  foodCategoryId?: number;
  foodCategory?: Category;
}
export interface CreateFoodItem {
  name: string;
  foodCategoryId?: number;
}

export interface UpdateFoodItem {
  name?: string;
  foodCategoryId?: number;
}