export const verifyOTPQuery = `
  mutation VerifyOTP($email: String!, $otp: String!) {
    verifyOTP(email: $email, otp: $otp) {
      verificationToken
      success
    }
  }
`;
