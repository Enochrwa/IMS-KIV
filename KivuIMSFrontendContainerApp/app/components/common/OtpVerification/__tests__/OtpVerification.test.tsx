import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OtpVerification, { VerifyEmailProps } from "../OtpVerification";
import AlertBannerContext from "../../../../context/alertBannerContext";

const mockSetAlert = jest.fn();

jest.mock("../../../../context/alertBannerContext", () => ({
  __esModule: true,
  default: React.createContext({
    setAlert: jest.fn()
  })
}));

const mockMutateAsync = jest.fn();

jest.mock("../../../../hooks/api/useVerifyOTP", () => ({
  __esModule: true,
  useVerifyEmailOtp: () => ({
    mutateAsync: mockMutateAsync
  })
}));

jest.mock("@kivunova/kivufrontendcommon", () => ({
  __esModule: true,
  useKivunovaTranslation: () => ({
    t: (_key: string, fallback?: string) => fallback || _key
  }),
  KivuI18nContext: React.createContext({
    language: "en",
    defaultLang: "en"
  }),
  localizedPath: (path: string) => path
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>
  }
}));

// QueryClient
const queryClient = new QueryClient();

const renderOtp = (props?: Partial<VerifyEmailProps>) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AlertBannerContext.Provider value={{ setAlert: mockSetAlert }}>
        <MemoryRouter>
          <OtpVerification
            otpType="email"
            loginInfo="test@example.com"
            onVerifySuccess={props?.onVerifySuccess || jest.fn()}
            onBackToLogin={props?.onBackToLogin || jest.fn()}
          />
        </MemoryRouter>
      </AlertBannerContext.Provider>
    </QueryClientProvider>
  );
};

describe("OtpVerification (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders OTP verification UI", () => {
    const { asFragment } = renderOtp();
    expect(asFragment()).toMatchSnapshot();
  });

  it("shows error when submitting incomplete OTP", async () => {
    renderOtp();

    fireEvent.click(screen.getByText("Submit"));

    expect(
      await screen.findByText("Please fill in all 6 digits before submitting.")
    ).toBeInTheDocument();
  });

  it("submits OTP and calls onVerifySuccess when API returns OK", async () => {
    const mockSuccess = jest.fn();

    // FIXED — mutateAsync should call onSuccess
    mockMutateAsync.mockImplementationOnce((_vars, opts) => {
      opts.onSuccess({
        verifyEmailOtp: { code: "OK" }
      });
      return Promise.resolve();
    });

    renderOtp({ onVerifySuccess: mockSuccess });

    const fields = screen.getAllByRole("textbox");
    fields.forEach((f, i) =>
      fireEvent.change(f, { target: { value: `${i + 1}` } })
    );

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(mockSuccess).toHaveBeenCalled(); // NOW WORKS
    });
  });

  it("calls setAlert when API returns non-OK code", async () => {
    mockMutateAsync.mockImplementationOnce((_vars, opts) => {
      opts.onSuccess({
        verifyEmailOtp: { code: "ACCESS_DENIED" }
      });
      return Promise.resolve();
    });

    renderOtp();

    const fields = screen.getAllByRole("textbox");
    fields.forEach((f, i) =>
      fireEvent.change(f, { target: { value: `${i + 1}` } })
    );

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalled(); // NOW WORKS
    });
  });

  it("calls onBackToLogin", () => {
    const mockBack = jest.fn();

    renderOtp({ onBackToLogin: mockBack });

    fireEvent.click(screen.getByText("Back to Login"));

    expect(mockBack).toHaveBeenCalled();
  });
});
