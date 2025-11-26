import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import { verifyOTPQuery } from "../../Graphql/querries/verifyOTPQuery";
import {
  OtpVerifyRequest,
  OtpVerifyResponse
} from "../../components/common/OtpVerification/types/otpVerification";

export const useVerifyOtp = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<OtpVerifyResponse, Error, OtpVerifyRequest>({
    mutationKey: ["verifyOtp"],
    mutationFn: ({ email, otp }) =>
      fetchGraphQL(verifyOTPQuery, { email, otp }, setAlert)
  });
};
