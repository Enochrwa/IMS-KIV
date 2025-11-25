import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../components/Products/types/products";
import { SampleProducts } from "../../components/Products/constants/products";

export interface ProductState {
  productList: Product[];
  productDetail?: Product;
}

export const initialProductState: ProductState = {
  productList: SampleProducts,
  productDetail: SampleProducts[0]
};

// TODO: this is a sample slice. please update based on your use case
export const productSlice = createSlice({
  name: "product",
  initialState: initialProductState,
  reducers: {
    setProductList: (state, action: PayloadAction<Product[]>) => {
      state.productList = action.payload;
    },
    resetProductList: (state) => {
      state.productList = initialProductState.productList;
    },
    // add product list from pagination
    addProductList: (state, action: PayloadAction<Product[]>) => {
      state.productList = [...state.productList, ...action.payload];
    },
    setProductDetail: (state, action: PayloadAction<Product>) => {
      state.productDetail = action.payload;
    },
    resetProductDetail: (state) => {
      state.productDetail = initialProductState.productDetail;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setProductList,
  resetProductList,
  addProductList,
  setProductDetail,
  resetProductDetail
} = productSlice.actions;

export default productSlice.reducer;
