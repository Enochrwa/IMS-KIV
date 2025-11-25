export interface ForgotPasswordRequest {
  email: string;
  appBaseUrl: string;
}

export interface ForgotPasswordResponse {
  forgotPassword: {
    code: string;
  };
}
