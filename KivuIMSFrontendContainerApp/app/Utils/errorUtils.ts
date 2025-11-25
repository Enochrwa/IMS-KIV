import { ALERT_BANNER_CODE } from "../Enums/alertCode";

/**
 * Derive an ALERT_BANNER_CODE from an unknown error payload.
 *
 * This helper centralizes the fallbacks used across components: if the error
 * contains an `errorCode` field or the Error.message matches a known code,
 * return that. Otherwise fall back to INTERNAL_SERVER_ERROR.
 */
export const getAlertErrorCode = (error: unknown): ALERT_BANNER_CODE => {
  if (!error) return ALERT_BANNER_CODE.INTERNAL_SERVER_ERROR;

  // If the error is an object carrying an `errorCode` property
  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;
    const maybe = errObj.errorCode ?? errObj.code ?? errObj.message;
    if (typeof maybe === "string") {
      const entries = Object.values(ALERT_BANNER_CODE) as string[];
      if (entries.includes(maybe)) return maybe as ALERT_BANNER_CODE;
    }
  }

  // If it's an Error instance, check message
  if (error instanceof Error) {
    const msg = error.message;
    const entries = Object.values(ALERT_BANNER_CODE) as string[];
    if (entries.includes(msg)) return msg as ALERT_BANNER_CODE;
  }

  // If it's a plain string, check it
  if (typeof error === "string") {
    const entries = Object.values(ALERT_BANNER_CODE) as string[];
    if (entries.includes(error)) return error as ALERT_BANNER_CODE;
  }

  return ALERT_BANNER_CODE.INTERNAL_SERVER_ERROR;
};

export default getAlertErrorCode;
