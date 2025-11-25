export const getCompanyQuery = `
  query GetCompany($input: AuthInput!) {
    getCompany(input: $input) {
      name
      businessType
      currencyCode
      registrationNumber
      description
      address {
        country
        province
        district
        sector
        cell
        village
        streetAddress
      }
    }
  }
`;

export const updateCompanyQuery = `
  mutation UpdateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      name
      businessType
      currencyCode
      registrationNumber
      description
      address {
        country
        province
        district
        sector
        cell
        village
        streetAddress
      }
    }
  }
`;
