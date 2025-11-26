export const verifyOTPQuery = `
  mutation verifyEmailOtp($input: VerifyEmailOtpInput!) {
    verifyEmailOtp(input: $input) {
      verificationToken
    }
  }
`;
