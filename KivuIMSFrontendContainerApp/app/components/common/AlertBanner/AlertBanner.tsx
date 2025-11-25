import React, { useState, useEffect, FC, useContext } from "react";
import { Alert } from "@mui/material";
import AlertBannerContext from "../../../context/alertBannerContext";
import { AlertBannerCodeMap } from "../../../constants/AlertBannertCodeMap";
import { ALERT_BANNER_CODE_VARIANT } from "../../../Enums/alertCode";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";

const AlertBannerText: FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { alert, resetAlert } = useContext(AlertBannerContext);
  const { t } = useKivunovaTranslation();

  useEffect(() => {
    let timer;
    if (!alert) {
      setIsVisible(false);
    } else {
      // Show the banner and set a timer to hide it after 10 seconds
      setIsVisible(true);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      timer = setTimeout(() => {
        setIsVisible(false);
        resetAlert();
      }, 10000);
    }

    // Cleanup timer to avoid memory leaks
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [alert]);

  if (!isVisible || !alert) return null; // Hide the banner when isVisible is false

  const errorTextMap =
    AlertBannerCodeMap[alert.code] || AlertBannerCodeMap.INTERNAL_SERVER_ERROR;

  return (
    <Alert
      sx={{ textAlign: "center" }}
      severity={alert.severity}
      onClose={resetAlert}
      variant={ALERT_BANNER_CODE_VARIANT.OUTLINED}
    >
      {t(errorTextMap.translationKey, errorTextMap.value)}
    </Alert>
  );
};

export default AlertBannerText;
