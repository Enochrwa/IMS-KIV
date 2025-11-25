import { LOGOUT_STATUS } from "../../context/enums/authEnums";

export interface AuthorizeResponse {
  validateToken: {
    code: string;
    valid: boolean;
  };
}

export interface LogoutResponse {
  logout: {
    status: LOGOUT_STATUS;
  };
}
