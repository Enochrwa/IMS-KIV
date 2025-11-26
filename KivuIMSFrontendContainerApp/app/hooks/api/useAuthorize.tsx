import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { AuthContextInfo } from "../../context/types/authContextType";
import { AUTH_STATUS } from "../../context/enums/authEnums";
import { AuthorizeRequest, AuthorizeResponse } from "../../Graphql/types/auth";
import { fetchGraphQL } from "../../Graphql/utils";
import { authorizeQuery } from "../../Graphql/querries/authQuery";
import { LOCAL_STORAGE_KEYS } from "../../Enums/localStorage";
import { getLocalStorageElement } from "../../Utils/localStorageUtils";
import { API_RESPONSE_CODE } from "../../Enums/api";

const useAuthorize = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const [authContextInfo, updateAuthContextInfo] = useState<AuthContextInfo>({
    auth: { status: AUTH_STATUS.UNAUTHENTICATED }
  });

  return useMutation<AuthorizeResponse, Error, AuthorizeRequest>({
    mutationKey: ["authorize"],
    mutationFn: () => {
      const input: AuthorizeRequest = {
        accessToken: getLocalStorageElement(LOCAL_STORAGE_KEYS.ACCESS_TOKEN),
        refreshToken: getLocalStorageElement(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
      };
      return fetchGraphQL(authorizeQuery, { input }, setAlert);
    },
    onSuccess: (response) => {
      const { code, authorized, refreshToken, accessToken } =
        response.authorize;

      if (code === API_RESPONSE_CODE.OK && authorized) {
        // set token data when token are refreshed

        if (accessToken) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        }

        if (refreshToken) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }

        updateAuthContextInfo({
          ...authContextInfo,
          auth: {
            status: AUTH_STATUS.AUTHENTICATED,
            authorized
          }
        });
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        throw new Error("UNAUTHORIZED");
      }
    },
    onError: (error) => {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      throw new Error(error?.message || "UNAUTHORIZED");
    }
  });
};

export default useAuthorize;
