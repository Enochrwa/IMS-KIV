// React imported below for mocked context
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { UseMutationResult } from "@tanstack/react-query";
import AlertBannerProvider from "../../../providers/AlertBannerProvider";
import { FORGOT_PWD_STEP } from "../Enums/forgotPasswordSteps";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse
} from "../../../Graphql/types/forgotPassword";

// Mock the hook used by the component so tests can control mutation behavior
jest.mock("../../../hooks/api/useForgotPassword", () => ({
  __esModule: true,
  default: jest.fn()
}));

import useForgotPassword from "../../../hooks/api/useForgotPassword";

// Mock the external i18n package used by the component so Jest doesn't load
// heavy runtime or require ESM transforms (and to make t() return defaults).
import * as React from "react";

jest.mock("@kivunova/kivufrontendcommon", () => ({
  __esModule: true,
  useKivunovaTranslation: () => ({ t: (k: string, d: string) => d }),
  KivuI18nContext: React.createContext({ language: "en", defaultLang: "en" }),
  localizedPath: (p: string) => p
}));

import ForgotOtpForm from "../ForgotPassword";

const useForgotPasswordMock = useForgotPassword as jest.MockedFunction<
  typeof useForgotPassword
>;

describe("ForgotPasswordForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form, input and buttons", () => {
    useForgotPasswordMock.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
      data: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isLoading: false,
      isSuccess: false,
      mutate: jest.fn(),
      reset: jest.fn(),
      status: "idle",
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      submittedAt: 0
    } as unknown as UseMutationResult<
      ForgotPasswordResponse,
      Error,
      ForgotPasswordRequest
    >);

    const queryClient = new QueryClient();
    const setNextStep = jest.fn();
    const setEmail = jest.fn();

    const { container } = render(
      <ForgotOtpForm setNextStep={setNextStep} setEmail={setEmail} />,
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

    expect(screen.getByTestId("forgot-password-email")).toBeInTheDocument();
    expect(screen.getByTestId("forgot-password-submit")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("calls mutateAsync with the email on submit and sets next step", async () => {
    const mutateAsync = jest.fn().mockResolvedValue({});
    useForgotPasswordMock.mockReturnValue({
      mutateAsync,
      isPending: false,
      data: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isLoading: false,
      isSuccess: false,
      mutate: jest.fn(),
      reset: jest.fn(),
      status: "idle",
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      submittedAt: 0
    } as unknown as UseMutationResult<
      ForgotPasswordResponse,
      Error,
      ForgotPasswordRequest
    >);

    const queryClient = new QueryClient();
    const setNextStep = jest.fn();
    const setEmail = jest.fn();

    render(<ForgotOtpForm setNextStep={setNextStep} setEmail={setEmail} />, {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <AlertBannerProvider>
            <MemoryRouter>{children}</MemoryRouter>
          </AlertBannerProvider>
        </QueryClientProvider>
      )
    });

    const user = userEvent.setup();

    const emailInput = screen.getByTestId("forgot-password-email");
    await user.type(emailInput, "test@example.com");

    const submit = screen.getByTestId("forgot-password-submit");
    await user.click(submit);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenCalledWith({ email: "test@example.com" });

    await waitFor(() =>
      expect(setNextStep).toHaveBeenCalledWith(FORGOT_PWD_STEP.VALIDATE_OTP)
    );
  });

  it("shows loading state when mutation is pending", () => {
    useForgotPasswordMock.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: true,
      data: undefined,
      error: null,
      isError: false,
      isIdle: false,
      isLoading: true,
      isSuccess: false,
      mutate: jest.fn(),
      reset: jest.fn(),
      status: "loading",
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      submittedAt: 0
    } as unknown as UseMutationResult<
      ForgotPasswordResponse,
      Error,
      ForgotPasswordRequest
    >);

    const queryClient = new QueryClient();
    const setNextStep = jest.fn();
    const setEmail = jest.fn();

    render(<ForgotOtpForm setNextStep={setNextStep} setEmail={setEmail} />, {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <AlertBannerProvider>
            <MemoryRouter>{children}</MemoryRouter>
          </AlertBannerProvider>
        </QueryClientProvider>
      )
    });

    const submit = screen.getByTestId("forgot-password-submit");
    expect(submit).toBeDisabled();
  });
});
