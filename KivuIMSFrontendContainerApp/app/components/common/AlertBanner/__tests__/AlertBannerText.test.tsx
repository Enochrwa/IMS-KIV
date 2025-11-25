import React from "react";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AlertBannerContext from "../../../../context/alertBannerContext";
import AlertBannerText from "../AlertBanner";
import { AlertBannerCodeMap } from "../../../../constants/AlertBannertCodeMap";
import { AlertBanner } from "../../../../context/types/AlertBannerContextType";
import {
  ALERT_BANNER_CODE,
  ALERT_BANNER_CODE_SEVERITY,
  ALERT_BANNER_CODE_VARIANT
} from "../../../../Enums/alertCode";

// Mock scrollTo to avoid errors in jsdom
window.scrollTo = jest.fn();

jest.mock("@kivunova/kivufrontendcommon", () => {
  return {
    __esModule: true,
    useKivunovaTranslation: () => ({ t: (k: string, d?: string) => d || k }),
    KivuI18nContext: React.createContext({ language: "en", defaultLang: "en" })
  };
});

describe("AlertBannerText Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockResetAlert = jest.fn();
  const mockSetAlert = jest.fn();

  const renderWithContext = (alertValue: AlertBanner) =>
    render(
      <AlertBannerContext.Provider
        value={{
          alert: alertValue,
          resetAlert: mockResetAlert,
          setAlert: mockSetAlert
        }}
      >
        <AlertBannerText />
      </AlertBannerContext.Provider>
    );

  it("renders correctly when alert is provided", () => {
    const alert: AlertBanner = {
      code: ALERT_BANNER_CODE.REGISTRATION_SUCCESS,
      severity: ALERT_BANNER_CODE_SEVERITY.SUCCESS,
      variant: ALERT_BANNER_CODE_VARIANT.FILLED
    };

    const { asFragment } = renderWithContext(alert);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText(AlertBannerCodeMap.REGISTRATION_SUCCESS.value)
    ).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders fallback message when unknown code is used", () => {
    const alert = {
      code: "UNKNOWN_CODE" as ALERT_BANNER_CODE,
      severity: ALERT_BANNER_CODE_SEVERITY.ERROR
    };

    renderWithContext(alert);

    expect(
      screen.getByText(AlertBannerCodeMap.INTERNAL_SERVER_ERROR.value)
    ).toBeInTheDocument();
  });

  it("hides when no alert is provided", () => {
    renderWithContext(undefined as unknown as AlertBanner);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("calls resetAlert after timeout", () => {
    const alert = {
      code: ALERT_BANNER_CODE.REGISTRATION_SUCCESS,
      severity: ALERT_BANNER_CODE_SEVERITY.SUCCESS
    };

    renderWithContext(alert);

    // Initially visible
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(mockResetAlert).toHaveBeenCalled();
  });

  it("cleans up timer on unmount", () => {
    const alert = {
      code: ALERT_BANNER_CODE.REGISTRATION_SUCCESS,
      severity: ALERT_BANNER_CODE_SEVERITY.SUCCESS
    };
    const clearSpy = jest.spyOn(global, "clearTimeout"); // 👈 spy on clearTimeout

    const { unmount } = renderWithContext(alert);
    unmount();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore(); // clean up spy
  });
});
