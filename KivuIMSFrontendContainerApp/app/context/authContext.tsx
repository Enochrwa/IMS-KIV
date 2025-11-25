import { createContext } from "react";
import { AuthContextType } from "./types/authContextType";
import { AUTH_STATUS } from "./enums/authEnums";

const AuthContext = createContext<AuthContextType>({
  authContextInfo: { auth: { status: AUTH_STATUS.UNAUTHENTICATED } },
  updateAuthContextInfo: () => {}
});

export default AuthContext;
