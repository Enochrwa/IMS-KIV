import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { AuthContextInfo } from "../../context/types/authContextType";
import { AUTH_STATUS } from "../../context/enums/authEnums";
import { AuthorizeResponse } from "../../Graphql/types/auth";
import { fetchGraphQL } from "../../Graphql/utils";
import { authorizeQuery } from "../../Graphql/querries/authQuery";
import { LOCAL_STORAGE_KEYS } from "../../Enums/localStorage";
import { getLocalStorageElement } from "../../Utils/localStorageUtils";

const useAuthorize = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const [authContextInfo, updateAuthContextInfo] = useState<AuthContextInfo>({
    auth: { status: AUTH_STATUS.UNAUTHENTICATED }
  });

  const accessToken = getLocalStorageElement(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  return useMutation<AuthorizeResponse, Error>({
    mutationKey: ["authorize"],
    mutationFn: () =>
      fetchGraphQL(authorizeQuery, { input: { token: accessToken } }, setAlert),
    onSuccess: (response) => {
      const { code, valid } = response.validateToken;

      if (code === "OK" && valid) {
        updateAuthContextInfo({
          ...authContextInfo,
          auth: {
            status: AUTH_STATUS.AUTHENTICATED
          }
        });
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
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
