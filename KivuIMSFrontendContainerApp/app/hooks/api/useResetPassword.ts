import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import { resetPasswordQuery } from "../../Graphql/querries/resetPasswordQuery";
import {
  ResetPasswordRequest,
  ResetPasswordResponse
} from "../../Graphql/types/resetPassword";

const useResetPassword = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationKey: ["reset-password"],
    mutationFn: (input) => fetchGraphQL(resetPasswordQuery, { input }, setAlert)
  });
};

export default useResetPassword;
