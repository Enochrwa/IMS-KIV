export const authorizeQuery = `
 query validateToken($input: ValidateTokenInput!) {
      validateToken(input: $input) {
        code
        valid
    }
 }
`;
