import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../components/Category/types/categoryTypes";
import { CategoryData } from "../../components/Category/constants/categoryData";

interface CategoryState {
  categoryList: Category[];
  categoryDetail?: Category;
}

const initialState: CategoryState = {
  categoryList: CategoryData
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoryList: (state, action: PayloadAction<Category[]>) => {
      state.categoryList = action.payload;
    },
    setCategoryDetail: (state, action: PayloadAction<Category>) => {
      state.categoryDetail = action.payload;
    },
    resetCategoryDetail: (state) => {
      state.categoryDetail = initialState.categoryDetail;
    },
    resetCategoryList: (state) => {
      state.categoryList = initialState.categoryList;
    }
  }
});

export const {
  setCategoryList,
  setCategoryDetail,
  resetCategoryDetail,
  resetCategoryList
} = categorySlice.actions;

export default categorySlice.reducer;
