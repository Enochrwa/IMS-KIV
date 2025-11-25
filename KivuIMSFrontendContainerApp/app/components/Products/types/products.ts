import { ProductStatus } from "../enums/products";

export interface Product {
  id: string;
  name: string;
  productCategory: string;
  productSubcategory?: string;
  productSubcategoryItem?: string;
  minimumStockThreshold?: number;
  maximumStockThreshold?: number;
  leadTime?: number;
  dailyConsumption?: number;
  minSalesPrice?: number;
  purchasePrice?: number;
  material?: string;
  weight?: number;
  packagingType?: string;
  height?: number;
  width?: number;
  color?: string;
  thickness?: number;
  packSize?: string;
  description?: string;
  supplierId?: string;
  expirationDate?: string;
  productionDate?: string;
  brandName?: string;
  barcode?: string;
  lotNumber?: string;
  status: ProductStatus;
  storeId: string;
  companyId: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  productSubcategory?: string;
  productSubcategoryItem?: string;
  minimumStockThreshold?: number;
  maximumStockThreshold?: number;
  leadTime?: number;
  dailyConsumption?: number;
  minSalesPrice?: number;
  purchasePrice?: number;
  material?: string;
  weight?: number;
  packagingType?: string;
  height?: number;
  width?: number;
  color?: string;
  thickness?: number;
  packSize?: string;
  description?: string;
  supplierId?: string;
  expirationDate?: string;
  productionDate?: string;
  brandName?: string;
  barcode?: string;
  lotNumber?: string;
  name: string;
  productCategory: string;
}

export interface CreateProductResponse {
  createProduct: {
    code: string;
    product: Product;
  };
}

export interface GetProductListResponse {
  getProduct: {
    code: string;
    productList: Product[];
  };
}

export interface GetProductDetailResponse {
  getProductDetail: {
    code: string;
    product: Product;
  };
}

export interface UpdateProductResponse {
  updateProduct: {
    code: string;
    product: Product;
  };
}

export interface GetProductDetailRequest {
  productId: string;
}

export interface UpdateProductRequest {
  product: Product;
}
