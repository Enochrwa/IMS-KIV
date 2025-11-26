export const verifyOTPQuery = `
  mutation VerifyOTP($email: String!, $otp: String!) {
    verifyOTP(email: $email, otp: $otp) {
      verificationToken
      success
    }
  }
`;

export const verifyEmailOtpQuery = `
 mutation VerifyEmailOtpQuery($input: VerifyEmailOtpInput!) {
   verifyEmailOtp(input: $input) {
     code
     verificationToken
   }
 }
`;
