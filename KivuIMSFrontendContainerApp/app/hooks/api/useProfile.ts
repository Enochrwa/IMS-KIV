import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import {
  changePasswordQuery,
  getProfileQuery,
  updateProfileQuery,
  uploadProfileImageQuery
} from "../../Graphql/querries/profileQuery";
import {
  ChangePasswordInput,
  ChangePasswordResponse,
  GetProfileResponse,
  UpdateProfileFormData,
  UpdateProfileResponse,
  UploadProfileImageResponse
} from "../../components/Profile/types/profileTypes";
import { getLocalStorageElement } from "../../Utils/localStorageUtils";
import { LOCAL_STORAGE_KEYS } from "../../Enums/localStorage";

export const useGetProfile = () => {
  const { setAlert } = useContext(AlertBannerContext);
  const token = getLocalStorageElement(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  // Mutation-based fetch: callers trigger it via `refetch()`/`mutateAsync()` and
  return useMutation<GetProfileResponse, Error>({
    mutationKey: ["profile"],
    mutationFn: () =>
      fetchGraphQL(getProfileQuery, { input: { accessToken: token } }, setAlert)
  });
};

export const useUpdateProfile = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<UpdateProfileResponse, Error, UpdateProfileFormData>({
    mutationKey: ["updateProfile"],
    mutationFn: (input) => fetchGraphQL(updateProfileQuery, { input }, setAlert)
  });
};

export const useChangePassword = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<ChangePasswordResponse, Error, ChangePasswordInput>({
    mutationKey: ["changePassword"],
    mutationFn: (input) =>
      fetchGraphQL(changePasswordQuery, { input }, setAlert)
  });
};

export const useUploadProfileImage = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<UploadProfileImageResponse, Error, File>({
    mutationKey: ["uploadProfileImage"],
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetchGraphQL(
        uploadProfileImageQuery,
        { file: formData },
        setAlert
      );
    }
  });
};
