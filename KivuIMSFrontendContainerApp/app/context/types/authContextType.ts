import { AUTH_STATUS } from "../enums/authEnums";

export interface OtpCInfo {
  email?: string;
}

export interface AuthStatus {
  status: AUTH_STATUS;
  authorized?: boolean;
}

export interface AuthContextInfo {
  otp?: OtpCInfo;
  auth: AuthStatus;
}

export interface AuthContextType {
  authContextInfo: AuthContextInfo;
  updateAuthContextInfo: (info: AuthContextInfo) => void;
}
