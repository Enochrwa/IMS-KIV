import React, {
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { AUTH_STATUS } from "../context/enums/authEnums";
import {
  AuthContextInfo,
  AuthContextType
} from "../context/types/authContextType";
import useAuthorize from "../hooks/api/useAuthorize";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { KivuI18nContext, localizedPath } from "@kivunova/kivufrontendcommon";
import { PAGE_ROUTE_LOGIN } from "../PageRoutes";

const AuthProviders: FC<{ children: ReactNode }> = ({ children }) => {
  const [authContextInfo, updateAuthContextInfo] = useState<AuthContextInfo>({
    auth: { status: AUTH_STATUS.UNAUTHENTICATED }
  });
  const { language, defaultLang } = useContext(KivuI18nContext);
  const navigate = useNavigate();
  const useAuthorizeMutation = useAuthorize();

  useEffect(() => {
    (async () => {
      try {
        await useAuthorizeMutation.mutateAsync();
      } catch (e) {
        console.error("Failed to login", e);
        navigate(localizedPath(PAGE_ROUTE_LOGIN, language, defaultLang));
      }
    })();
  }, [authContextInfo.auth.status]);

  const authInfo = useMemo((): AuthContextType => {
    return { authContextInfo, updateAuthContextInfo };
  }, [authContextInfo]);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
