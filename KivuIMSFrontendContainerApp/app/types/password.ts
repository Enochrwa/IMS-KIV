// Base interfaces for password-related operations
export interface BasePasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export interface BasePasswordResponse {
  success: boolean;
  message?: string;
}

// Specific implementations
export interface PasswordChangeForm extends BasePasswordForm {
  currentPassword: string;
}

// ResetPasswordForm is identical to BasePasswordForm, so we use a type alias
export type ResetPasswordForm = BasePasswordForm;

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  verificationToken: string;
  newPassword: string;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
}

export type PasswordChangeResponse = BaseResponse;

export interface ResetPasswordResponse {
  resetPassword: BaseResponse;
}
