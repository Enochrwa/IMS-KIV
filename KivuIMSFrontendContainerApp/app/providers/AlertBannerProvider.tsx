import React, { type FC, type ReactNode, useMemo, useState } from "react";
import {
  AlertBanner,
  AlertBannerContextType
} from "../context/types/AlertBannerContextType";
import AlertBannerContext from "../context/alertBannerContext";

const AlertBannerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertBanner>();

  const resetAlert = () => {
    setAlert(undefined);
  };

  const contextValue = useMemo((): AlertBannerContextType => {
    return { alert, setAlert, resetAlert };
  }, [alert]);

  return (
    <AlertBannerContext.Provider value={contextValue}>
      {children}
    </AlertBannerContext.Provider>
  );
};

export default AlertBannerProvider;
