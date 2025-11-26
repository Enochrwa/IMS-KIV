import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import { requestVerificationOtpQuery } from "../../Graphql/querries/requestVerificationOtpQuery";
import {
  RequestVerificationOtpRequest,
  RequestVerificationOtpResponse
} from "../../Graphql/types/requestVerificationOtp";

const useRequestVerificationOtp = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<
    RequestVerificationOtpResponse,
    Error,
    RequestVerificationOtpRequest
  >({
    mutationKey: ["request-verification-otp"],
    mutationFn: (input) =>
      fetchGraphQL(requestVerificationOtpQuery, { input }, setAlert)
  });
};

export default useRequestVerificationOtp;
