// login/types/login.types.ts

// Interfaces and types related to login

export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: string;
// }

export interface LoginResponse {
  login: {
    code: string;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}
