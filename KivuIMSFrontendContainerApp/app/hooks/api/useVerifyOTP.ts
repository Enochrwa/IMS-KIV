import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import { verifyEmailOtpQuery } from "../../Graphql/querries/verifyOTPQuery";
import {
  OtpVerifyEmailRequest,
  OtpVerifyEmailResponse
} from "../../components/common/OtpVerification/types/otpVerification";

export const useVerifyEmailOtp = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<OtpVerifyEmailResponse, Error, OtpVerifyEmailRequest>({
    mutationKey: ["verifyEmailOtp"],
    mutationFn: (input) =>
      fetchGraphQL(verifyEmailOtpQuery, { input }, setAlert)
  });
};
