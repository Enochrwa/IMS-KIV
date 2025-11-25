import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import { forgotPasswordQuery } from "../../Graphql/querries/forgotPasswordQuery";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse
} from "../../Graphql/types/forgotPassword";

const useForgotPassword = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationKey: ["forgot-password"],
    mutationFn: (input) =>
      fetchGraphQL(forgotPasswordQuery, { input }, setAlert)
  });
};

export default useForgotPassword;
