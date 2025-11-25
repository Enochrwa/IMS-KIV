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
  CreateEmployeeResponse,
  EmployeeFormData,
  GetCompanyEmployeeListRequest,
  GetCompanyEmployeeListResponse,
  GetEmployeeDetailRequest,
  GetEmployeeDetailResponse,
  GetStoreEmployeeListRequest,
  GetStoreEmployeeListResponse,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse
} from "../../components/Employees/types/employees";
import {
  createEmployeeQuery,
  getCompanyEmployeeListQuery,
  getEmployeeDetailQuery,
  getStoreEmployeeListQuery,
  updateEmployeeQuery
} from "../../Graphql/querries/employees";
import {
  setEmployeeDetail,
  setEmployeeList
} from "../../store/slices/employeeSlice";

/**
 * useGetStoreEmployeeList
 * Fetch store employee List
 */
export const useGetStoreEmployeeList = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<
    GetStoreEmployeeListResponse,
    Error,
    GetStoreEmployeeListRequest
  >({
    mutationKey: ["getStoreEmployeeList"],
    mutationFn: (input) =>
      fetchGraphQL(getStoreEmployeeListQuery, { input }, setAlert),
    onSuccess: (response) => {
      dispatch(setEmployeeList(response.listStoreUsers.users));
    },
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.INTERNAL_ERROR
      });
    }
  });
};

/**
 * useGetCompanyEmployeeList
 * Fetch company employee List
 */
export const useGetCompanyEmployeeList = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<
    GetCompanyEmployeeListResponse,
    Error,
    GetCompanyEmployeeListRequest
  >({
    mutationKey: ["getCompanyEmployeeList"],
    mutationFn: (input) =>
      fetchGraphQL(getCompanyEmployeeListQuery, { input }, setAlert),
    onSuccess: (response) => {
      dispatch(setEmployeeList(response.listCompanyUsers.users));
    },
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.INTERNAL_ERROR
      });
    }
  });
};

/**
 * useCreateEmployee
 * Fetch created employee
 */
export const useCreateEmployee = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<CreateEmployeeResponse, Error, EmployeeFormData>({
    mutationKey: ["createEmployee"],
    mutationFn: (input) =>
      fetchGraphQL(createEmployeeQuery, { input }, setAlert),
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.INTERNAL_ERROR
      });
    }
  });
};

/**
 * useGetProductDetail
 * get employee details by id
 */
export const useGetEmployeeDetail = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<
    GetEmployeeDetailResponse,
    Error,
    GetEmployeeDetailRequest
  >({
    mutationKey: ["getEmployeeDetail"],
    mutationFn: (input) =>
      fetchGraphQL(getEmployeeDetailQuery, { input }, setAlert),
    onSuccess: (response) => {
      dispatch(setEmployeeDetail(response.getUser.user));
    },
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.INTERNAL_ERROR
      });
    }
  });
};

/**
 * useUpdateEmployee
 * Update existing product information
 */
export const useUpdateEmployee = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<UpdateEmployeeResponse, Error, UpdateEmployeeRequest>({
    mutationKey: ["updateEmployee"],
    mutationFn: (input) =>
      fetchGraphQL(updateEmployeeQuery, { input }, setAlert),
    onSuccess: (response) => {
      dispatch(setEmployeeDetail(response.updateUser.user));
    },
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.INTERNAL_ERROR
      });
    }
  });
};

/**
 * useDeleteEmployee
 * Delete existing product information
 */
export const useDeleteEmployee = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const dispatch = useDispatch();

  return useMutation<UpdateEmployeeResponse, Error, string>({
    mutationKey: ["deleteEmployee"],
    mutationFn: (input) =>
      fetchGraphQL(updateEmployeeQuery, { input }, setAlert),
    onSuccess: (response) => {
      dispatch(setEmployeeDetail(response.updateUser.user));
    },
    onError: (error) => {
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.INTERNAL_ERROR
      });
    }
  });
};
