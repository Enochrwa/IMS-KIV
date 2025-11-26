export type OTPType = "email" | "phone";

export interface OtpVerifyEmailResponse {
  verifyEmailOtp: {
    code: string;
  };
}

export interface OtpVerifyEmailRequest {
  email: string;
  otp: string;
}
