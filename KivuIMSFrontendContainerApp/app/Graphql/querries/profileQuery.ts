export const getProfileQuery = `
  query GetProfile($input: GetProfileInput!) {
    getProfile(input: $input) {
        code
        user {
            id
            firstName
            lastName
            email
            phone
            profileImage
            accountStatus
        }
    }
  }
`;

export const updateProfileQuery = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      firstName
      lastName
      email
      phone
      phoneCountryCode
      profileImage
      createdAt
      updatedAt
    }
  }
`;

export const changePasswordQuery = `
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`;

export const uploadProfileImageQuery = `
  mutation UploadProfileImage($file: Upload!) {
    uploadProfileImage(file: $file) {
      success
      message
      imageUrl
    }
  }
`;
