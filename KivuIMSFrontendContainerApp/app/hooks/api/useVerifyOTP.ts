import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import { verifyOTPQuery } from "../../Graphql/querries/verifyOTPQuery";
import {
  VerifyOTPRequest,
  VerifyOTPResponse
} from "../../components/OTPVerification/types/otpVerificationTypes";

const useVerifyOTP = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<VerifyOTPResponse, Error, VerifyOTPRequest>({
    mutationFn: (variables) =>
      fetchGraphQL<{ verifyOTP: VerifyOTPResponse }, VerifyOTPRequest>(
        verifyOTPQuery,
        variables,
        setAlert
      ).then((res) => res.verifyOTP)
  });
};

export default useVerifyOTP;
