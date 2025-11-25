import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/UserSlice";
import registrationSlice from "./slices/registrationSlice";
import profileSlice from "./slices/profileSlice";
import productSlice from "./slices/productSlice";
import dashboardSlice from "./slices/dashboardSlice";
import categorySlice from "./slices/categorySlice";
import employeeSlice from "./slices/employeeSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    registration: registrationSlice,
    profile: profileSlice,
    products: productSlice,
    dashboard: dashboardSlice,
    categories: categorySlice,
    employees: employeeSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
