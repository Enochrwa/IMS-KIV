import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import {
  CreateProductResponse,
  GetProductDetailRequest,
  GetProductDetailResponse,
  GetProductListResponse,
  ProductFormData,
  UpdateProductRequest,
  UpdateProductResponse
} from "../../components/Products/types/products";
import {
  createProductQuery,
  getProductDetailQuery,
  getProductListQuery,
  updateProductQuery
} from "../../Graphql/querries/productQuery";
import { useDispatch } from "react-redux";
import {
  setProductDetail,
  setProductList
} from "../../store/slices/productSlice";
import {
  ALERT_BANNER_CODE,
  ALERT_BANNER_CODE_SEVERITY
} from "../../Enums/alertCode";

/**
 * useGetProductList
 * Fetch product List
 */
export const useGetProductList = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<GetProductListResponse, Error>({
    mutationKey: ["getProductList"],
    mutationFn: () => fetchGraphQL(getProductListQuery, {}, setAlert),
    onSuccess: (response) => {
      dispatch(setProductList(response.getProduct.productList));
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
 * useGetProductList
 * Fetch product List
 */
export const useCreateProduct = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<CreateProductResponse, Error, ProductFormData>({
    mutationKey: ["createProduct"],
    mutationFn: (input) =>
      fetchGraphQL(createProductQuery, { input }, setAlert),
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
 * useGetProductDetail
 * get product details by id
 */
export const useGetProductDetail = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<GetProductDetailResponse, Error, GetProductDetailRequest>({
    mutationKey: ["getProductDetail"],
    mutationFn: (input) =>
      fetchGraphQL(getProductDetailQuery, { input }, setAlert),
    onSuccess: (response) => {
      dispatch(setProductDetail(response.getProductDetail.product));
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
 * useUpdateCompany
 * Update existing product information
 */
export const useUpdateProduct = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<UpdateProductResponse, Error, UpdateProductRequest>({
    mutationKey: ["updateProduct"],
    mutationFn: (input) =>
      fetchGraphQL(updateProductQuery, { input }, setAlert),
    onSuccess: (response) => {
      dispatch(setProductDetail(response.updateProduct.product));
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
