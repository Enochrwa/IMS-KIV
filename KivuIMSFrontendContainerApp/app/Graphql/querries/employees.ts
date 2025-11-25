export const getStoreEmployeeListQuery = `
 mutation GetStoreEmployeeList($input: ListStoreUsersInput!) {
      listStoreUsers(input: $input) {
        code
        users {
            id
            firstName
            lastName
            email
            phone
            profileImage
            accountStatus
            role
        }
    }
 }
`;

export const getCompanyEmployeeListQuery = `
 mutation GetCompanyEmployeeList($input: ListCompanyUsersInput!) {
      listCompanyUsers(input: $input) {
        code
        users {
            id
            firstName
            lastName
            email
            phone
            profileImage
            accountStatus
            role
        }
    }
 }
`;

export const createEmployeeQuery = `
 mutation CreateEmployee($input: CreateUserInput!) {
       createUser(input: $input) {
        ... on CreateUserSuccess {
            code
            user {
                id
                firstName
                lastName
                email
                phone
                profileImage
                role
                accountStatus
            }
        }
        ... on CreateUserError {
            code
        }
    }
 }
`;

export const getEmployeeDetailQuery = `
 mutation GetEmployeeDetail($input: GetUserInput!) {
      getUser(input: $input) {
        id
    }
 }
`;

export const updateEmployeeQuery = `
 mutation UpdateEmployee($input: UpdateUserInput!) {
      updateUser(input: $input) {
        ... on UpdateUserSuccess {
            code
            user {
                id
                firstName
                lastName
                email
                phone
                profileImage
                role
                accountStatus
            }
        }
        ... on UpdateUserError {
            code
        }
    }
 }
`;
