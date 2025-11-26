export const requestVerificationOtpQuery = `
  mutation RequestVerificationOtp($input: RequestVerificationOtpInput!) {
    requestVerificationOtp(input: $input) {
      code
    }
  }
`;
