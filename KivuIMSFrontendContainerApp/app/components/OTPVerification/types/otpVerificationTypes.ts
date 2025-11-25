export interface OTPVerificationData {
  otp: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  verificationToken: string;
  success: boolean;
}
