export const authorizeQuery = `
 mutation Authorize($input: AuthorizeInput!) {
      authorize(input: $input) {
        code
        authorized
        accessToken
        refreshToken
    }
 }
`;
