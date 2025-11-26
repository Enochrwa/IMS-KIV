export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  forgotPassword: {
    code: string;
  };
}
