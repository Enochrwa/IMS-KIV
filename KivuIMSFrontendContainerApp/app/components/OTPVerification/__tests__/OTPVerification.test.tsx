import React from "react";
// Mock GraphQL util that references Vite's import.meta so Jest doesn't try to parse import.meta
jest.mock("../../../Graphql/utils", () => ({
  __esModule: true,
  fetchGraphQL: jest.fn()
}));
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlertBannerProvider from "../../../providers/AlertBannerProvider";
import { FORGOT_PWD_STEP } from "../../ForgotPassword/Enums/forgotPasswordSteps";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../hooks/api/useVerifyOTP", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("@kivunova/kivufrontendcommon", () => ({
  __esModule: true,
  useKivunovaTranslation: () => ({ t: (k: string, d: string) => d }),
  KivuI18nContext: React.createContext({ language: "en", defaultLang: "en" }),
  localizedPath: (p: string) => p
}));

import useVerifyOTP from "../../../hooks/api/useVerifyOTP";
import { OtpValidation } from "../OTPVerification";

const useVerifyOTPMock = useVerifyOTP as jest.MockedFunction<
  typeof useVerifyOTP
>;

describe("OtpValidation component", () => {
  beforeEach(() => jest.clearAllMocks());

  function renderWithProviders(props: {
    email: string;
    setNextStep: jest.Mock;
    setupToken: jest.Mock;
  }) {
    const queryClient = new QueryClient();

    return render(
      <OtpValidation
        email={props.email}
        setNextStep={props.setNextStep}
        setupToken={props.setupToken}
      />,
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            <AlertBannerProvider>
              <MemoryRouter>{children}</MemoryRouter>
            </AlertBannerProvider>
          </QueryClientProvider>
        )
      }
    );
  }

  it("renders the OTP input and submit button", () => {
    const mockReturn = {
      mutateAsync: jest.fn(),
      isPending: false
    } as unknown as ReturnType<typeof useVerifyOTP>;
    useVerifyOTPMock.mockReturnValue(mockReturn);

    const setNextStep = jest.fn();
    const setupToken = jest.fn();

    const { container } = renderWithProviders({
      email: "test@example.com",
      setNextStep,
      setupToken
    });

    expect(screen.getByTestId("otp-verification-code")).toBeInTheDocument();
    expect(screen.getByTestId("otp-verification-submit")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("calls mutateAsync and sets token then calls setNextStep on success", async () => {
    const mutateAsync = jest
      .fn()
      .mockResolvedValue({ verificationToken: "token-123", success: true });
    const mockReturn = {
      mutateAsync,
      isPending: false
    } as unknown as ReturnType<typeof useVerifyOTP>;
    useVerifyOTPMock.mockReturnValue(mockReturn);

    const setNextStep = jest.fn();
    const setupToken = jest.fn();

    renderWithProviders({
      email: "test@example.com",
      setNextStep,
      setupToken
    });

    const user = userEvent.setup();

    const otpInput = screen.getByTestId("otp-verification-code");
    const submit = screen.getByTestId("otp-verification-submit");

    await user.type(otpInput, "123456");
    await user.click(submit);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenCalledWith({
      email: "test@example.com",
      otp: "123456"
    });

    await waitFor(() => expect(setupToken).toHaveBeenCalledWith("token-123"));
    expect(setNextStep).toHaveBeenCalledWith(FORGOT_PWD_STEP.RESET);
  });

  it("shows loading state when mutation is pending", () => {
    const mockReturn = {
      mutateAsync: jest.fn(),
      isPending: true
    } as unknown as ReturnType<typeof useVerifyOTP>;
    useVerifyOTPMock.mockReturnValue(mockReturn);

    const setNextStep = jest.fn();
    const setupToken = jest.fn();

    renderWithProviders({
      email: "test@example.com",
      setNextStep,
      setupToken
    });

    const submit = screen.getByTestId("otp-verification-submit");
    expect(submit).toBeDisabled();
  });
});
