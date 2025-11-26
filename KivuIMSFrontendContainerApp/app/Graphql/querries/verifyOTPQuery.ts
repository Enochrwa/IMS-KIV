export const verifyOTPQuery = `
  mutation VerifyOTP($input: VerifyOTPInput!) {
    verifyOTP(input: $input) {
      verificationToken
      success
    }
  }
`;
