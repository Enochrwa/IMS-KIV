import {
  Category,
  CategoryFormData
} from "../../components/Category/types/categoryTypes";

export interface GetCategoryListResponse {
  getCategories: { categoryList: Category[] };
}

export interface CreateCategoryResponse {
  createCategory: { category: Category };
}

export interface GetCategoryDetailRequest {
  id: string;
}

export interface GetCategoryDetailResponse {
  getCategoryDetail: { category: Category };
}

export interface UpdateCategoryRequest {
  id: string;
  input: Partial<CategoryFormData>;
}

export interface UpdateCategoryResponse {
  updateCategory: { category: Category };
}

export interface DeleteCategoryRequest {
  id: string;
}

export interface DeleteCategoryResponse {
  deleteCategory: boolean;
}
