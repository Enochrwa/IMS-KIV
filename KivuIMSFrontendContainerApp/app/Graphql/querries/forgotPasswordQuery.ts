export const forgotPasswordQuery = `
 mutation ForgotPassword($input: ForgotPasswordInput!) {
   forgotPassword(input: $input) {
     code
   }
 }
`;
