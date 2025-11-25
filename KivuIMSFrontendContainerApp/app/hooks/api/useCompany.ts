import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import {
  getCompanyQuery,
  updateCompanyQuery
} from "../../Graphql/querries/companyQuery";
import { getLocalStorageElement } from "../../Utils/localStorageUtils";
import { LOCAL_STORAGE_KEYS } from "../../Enums/localStorage";
import {
  CompanyData,
  GetCompanyResponse,
  UpdateCompanyResponse
} from "../../components/Profile/types/profileTypes";

/**
 * useGetCompany
 * Fetch company info by using access token from local storage
 */
export const useGetCompany = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const token = getLocalStorageElement(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  return useMutation<GetCompanyResponse, Error>({
    mutationKey: ["company"],
    mutationFn: () =>
      fetchGraphQL(getCompanyQuery, { input: { accessToken: token } }, setAlert)
  });
};

/**
 * useUpdateCompany
 * Update existing company information
 */
export const useUpdateCompany = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<UpdateCompanyResponse, Error, CompanyData>({
    mutationKey: ["updateCompany"],
    mutationFn: (input) => fetchGraphQL(updateCompanyQuery, { input }, setAlert)
  });
};
