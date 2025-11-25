import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import AlertBannerContext from "../../context/alertBannerContext";
import { fetchGraphQL } from "../../Graphql/utils";
import { registrationQuery } from "../../Graphql/querries/registrationQuery";
import {
  RegisterRequest,
  RegisterResponse
} from "../../Graphql/types/register";

const useCreateAccount = () => {
  const { setAlert } = useContext(AlertBannerContext);

  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationKey: ["register"],
    mutationFn: (input) => fetchGraphQL(registrationQuery, { input }, setAlert)
  });
};

export default useCreateAccount;
