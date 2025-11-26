export const loginQuery = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      code
      accessToken
      refreshToken
      emailVerified
      passwordChangeRequired
    }
  }
`;
