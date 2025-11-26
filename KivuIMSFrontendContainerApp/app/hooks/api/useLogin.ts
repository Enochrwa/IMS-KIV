import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import {
  LoginRequest,
  LoginResponse
} from "../../components/Login/types/login.types";
import { loginQuery } from "../../Graphql/querries/loginQuery";
import {
  KivuI18nContext,
  localizedPath,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem
} from "@kivunova/kivufrontendcommon";
import { LOCAL_STORAGE_KEYS } from "../../Enums/localStorage";
import {
  ALERT_BANNER_CODE,
  ALERT_BANNER_CODE_SEVERITY
} from "../../Enums/alertCode";
import { API_RESPONSE_CODE } from "../../Enums/api";
import { useNavigate } from "react-router-dom";
import { AUTH_STATUS } from "../../context/enums/authEnums";
import { PAGE_PORTAL_DASHBOARD, PORTAL_PREFIX } from "../../PageRoutes";
import AuthContext from "../../context/authContext";

const useLogin = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const { authContextInfo, updateAuthContextInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const { language, defaultLang } = useContext(KivuI18nContext);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: ["login"],
    mutationFn: (input) => fetchGraphQL(loginQuery, { input }, setAlert),
    onSuccess: (response) => {
      const { accessToken, refreshToken, code, emailVerified } =
        response?.login || {};
      if (code === API_RESPONSE_CODE.LOGIN_SUCCESS) {
        if (accessToken) {
          setLocalStorageItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        }
        if (refreshToken) {
          setLocalStorageItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }

        if (emailVerified) {
          navigate(
            localizedPath(
              `${PORTAL_PREFIX}/${PAGE_PORTAL_DASHBOARD}`,
              language,
              defaultLang
            )
          );
        } else {
          updateAuthContextInfo({
            ...authContextInfo,
            auth: {
              status: AUTH_STATUS.VERIFY_EMAIL_REQUIRED
            }
          });
        }
      } else {
        removeLocalStorageItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
        removeSessionStorageItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

        // throw error when login code is not success
        throw new Error(code);
      }
    },
    onError: (error) => {
      removeLocalStorageItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      removeSessionStorageItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: error.message
          ? (error.message as ALERT_BANNER_CODE)
          : ALERT_BANNER_CODE.ACCESS_DENIED
      });
    }
  });
};

export default useLogin;
