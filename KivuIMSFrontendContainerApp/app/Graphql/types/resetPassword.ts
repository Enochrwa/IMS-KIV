export interface ResetPasswordRequest {
  verificationToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  resetPassword: {
    success: boolean;
    message?: string;
  };
}
