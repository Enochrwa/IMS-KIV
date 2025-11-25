import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import { useDispatch } from "react-redux";
import {
  ALERT_BANNER_CODE,
  ALERT_BANNER_CODE_SEVERITY
} from "../../Enums/alertCode";
import {
  getCategoryListQuery,
  createCategoryQuery,
  getCategoryDetailQuery,
  updateCategoryQuery,
  deleteCategoryQuery
} from "../../Graphql/querries/categoryQuery";
import {
  setCategoryDetail,
  setCategoryList
} from "../../store/slices/categorySlice";
import {
  CreateCategoryResponse,
  DeleteCategoryRequest,
  DeleteCategoryResponse,
  GetCategoryDetailRequest,
  GetCategoryDetailResponse,
  GetCategoryListResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse
} from "../../Graphql/types/category";
import { CategoryFormData } from "../../components/Category/types/categoryTypes";

/**
 * useGetCategoryList
 * Fetch category list
 */
export const useGetCategoryList = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<GetCategoryListResponse, Error>({
    mutationKey: ["getCategoryList"],
    mutationFn: () => fetchGraphQL(getCategoryListQuery, {}, setAlert),
    onSuccess: (response) => {
      dispatch(setCategoryList(response.getCategories.categoryList));
    },
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.ACCESS_DENIED
      });
    }
  });
};

/**
 * useCreateCategory
 * Create a new category
 */
export const useCreateCategory = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<CreateCategoryResponse, Error, CategoryFormData>({
    mutationKey: ["createCategory"],
    mutationFn: (input) =>
      fetchGraphQL(createCategoryQuery, { input }, setAlert),
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.ACCESS_DENIED
      });
    }
  });
};

/**
 * useGetCategoryDetail
 * Fetch category details by ID
 */
export const useGetCategoryDetail = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<
    GetCategoryDetailResponse,
    Error,
    GetCategoryDetailRequest
  >({
    mutationKey: ["getCategoryDetail"],
    mutationFn: (input) =>
      fetchGraphQL(getCategoryDetailQuery, { input }, setAlert),
    onSuccess: (response) => {
      dispatch(setCategoryDetail(response.getCategoryDetail.category));
    },
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.ACCESS_DENIED
      });
    }
  });
};

/**
 * useUpdateCategory
 * Update an existing category
 */
export const useUpdateCategory = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<UpdateCategoryResponse, Error, UpdateCategoryRequest>({
    mutationKey: ["updateCategory"],
    mutationFn: (input) =>
      fetchGraphQL(updateCategoryQuery, { input }, setAlert),
    onSuccess: (response) => {
      dispatch(setCategoryDetail(response.updateCategory.category));
    },
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.ACCESS_DENIED
      });
    }
  });
};

/**
 * useDeleteCategory
 * Delete a category by ID
 */
export const useDeleteCategory = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<DeleteCategoryResponse, Error, DeleteCategoryRequest>({
    mutationKey: ["deleteCategory"],
    mutationFn: (input) =>
      fetchGraphQL(deleteCategoryQuery, { input }, setAlert),
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.ACCESS_DENIED
      });
    }
  });
};
