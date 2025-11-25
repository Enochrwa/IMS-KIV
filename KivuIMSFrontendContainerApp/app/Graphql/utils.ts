import { AlertBanner } from "../context/types/AlertBannerContextType";
import { getLocalStorageElement } from "../Utils/localStorageUtils";
import { LOCAL_STORAGE_KEYS, UNKNOWN } from "../Enums/localStorage";
import { GraphQLResponse } from "./types/common";
import { AlertBannerCodeMap } from "../constants/AlertBannertCodeMap";
import {
  ALERT_BANNER_CODE,
  ALERT_BANNER_CODE_SEVERITY
} from "../Enums/alertCode";

export const fetchGraphQL = async <T, E>(
  query: string,
  variables: E,
  setAlert: (alert: AlertBanner) => void
): Promise<T> => {
  const graphqlEndpoint =
    import.meta?.env?.VITE_GQL_ENDPOINT ?? "http://localhost:8081/graphql";
  const token = getLocalStorageElement(LOCAL_STORAGE_KEYS.TOKEN);
  const accessToken = getLocalStorageElement(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  const response = await fetch(graphqlEndpoint || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken || "UNKNOWN"}`,
      token: token || UNKNOWN
    },
    body: JSON.stringify({ query, variables })
  });

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    const errorCode = result.errors[0].extensions?.errorCode;
    const errorMessage =
      AlertBannerCodeMap[errorCode as ALERT_BANNER_CODE] ||
      AlertBannerCodeMap.INTERNAL_SERVER_ERROR;
    setAlert({
      severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
      code: errorCode as ALERT_BANNER_CODE
    });
    throw new Error(errorMessage?.value);
  }

  return result.data;
};

export const uploadFileGraphQL = async <T, E>(
  query: string,
  variables: E,
  file: File,
  setAlert: (alert: AlertBanner) => void
): Promise<T> => {
  const formData = new FormData();
  const grapqlEnpoint =
    import.meta.env?.VITE_GQL_ENDPOINT ?? "http://localhost:8081/graphql";
  const token = getLocalStorageElement(LOCAL_STORAGE_KEYS.TOKEN);
  const accessToken = getLocalStorageElement(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  const map = JSON.stringify({
    file: ["variables.file"]
  });

  // Append fields to FormData
  formData.append("operations", JSON.stringify({ query, variables }));
  formData.append("map", map);
  formData.append("file", file);

  const response = await fetch(grapqlEnpoint || "", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken || "UNKNOWN"}`,
      token: token || UNKNOWN
    },
    body: formData
  });

  if (!response.ok) {
    setAlert({
      severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
      code: ALERT_BANNER_CODE.FAILED_TO_UPLOAD_FILE_TO_S3
    });

    throw new Error("Failed to upload file");
  }

  const result: GraphQLResponse<T> = await response.json();

  // throw error with a valid error message
  if (result.errors) {
    const errorCode = result.errors[0].extensions?.errorCode;
    const errorMessage =
      AlertBannerCodeMap[errorCode as ALERT_BANNER_CODE] ||
      AlertBannerCodeMap.INTERNAL_SERVER_ERROR;
    setAlert({
      severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
      code: errorCode as ALERT_BANNER_CODE
    });
    throw new Error(errorMessage.value);
  }

  return result.data;
};
