import { LOGOUT_STATUS } from "../../context/enums/authEnums";

export interface AuthorizeResponse {
  authorize: {
    code: string;
    authorized: boolean;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthorizeRequest {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  logout: {
    status: LOGOUT_STATUS;
  };
}
