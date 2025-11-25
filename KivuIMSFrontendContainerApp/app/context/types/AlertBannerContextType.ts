import {
  ALERT_BANNER_CODE,
  ALERT_BANNER_CODE_SEVERITY,
  ALERT_BANNER_CODE_VARIANT
} from "../../Enums/alertCode";

export interface AlertBanner {
  severity: ALERT_BANNER_CODE_SEVERITY;
  code: ALERT_BANNER_CODE;
  variant?: ALERT_BANNER_CODE_VARIANT;
}

export interface AlertBannerContextType {
  alert?: AlertBanner;
  setAlert: (alert: AlertBanner) => void;
  resetAlert: () => void;
}
