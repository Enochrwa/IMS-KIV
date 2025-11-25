import { createContext } from "react";
import { AlertBannerContextType } from "./types/AlertBannerContextType";

const AlertBannerContext = createContext<AlertBannerContextType>({
  setAlert: () => {},
  resetAlert: () => {}
});

export default AlertBannerContext;
