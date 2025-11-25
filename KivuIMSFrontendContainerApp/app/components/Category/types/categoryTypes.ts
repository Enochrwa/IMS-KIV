import { CATEGORY_STATUS } from "../enums/categoryEnums";

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  path?: string;
  depth: number;
  status: CATEGORY_STATUS;
  companyId: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentId?: string | null;
  status?: CATEGORY_STATUS;
  companyId: string;
  createdBy: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}
