import React from "react";
import {
  COUNTRY_CODE,
  KivuEnvConfigContext,
  STAGE
} from "@kivunova/kivufrontendcommon";

export const KivuEnvConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const countryCode = import.meta.env.VITE_COUNTRY_CODE || COUNTRY_CODE.RWANDA;
  const stage = import.meta.env.VITE_STAGE || STAGE.STAGING;

  return (
    <KivuEnvConfigContext.Provider value={{ countryCode, stage }}>
      {children}
    </KivuEnvConfigContext.Provider>
  );
};
