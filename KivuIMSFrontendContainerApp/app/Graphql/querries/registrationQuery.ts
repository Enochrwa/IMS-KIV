export const registrationQuery = `
 mutation Register($input: RegisterCompanyInput!) {
      register(input: $input) {
        userId
    }
 }
`;
