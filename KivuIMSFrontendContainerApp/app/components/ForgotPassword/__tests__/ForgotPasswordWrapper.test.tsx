import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ForgotPasswordWrapper from "../ForgotPasswordWrapper";
import { FORGOT_PWD_STEP } from "../Enums/forgotPasswordSteps";

// mock useNavigate so we can assert navigation without relying on router history
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return { ...original, useNavigate: () => mockedNavigate };
});

jest.mock("@tanstack/react-query", () => ({
  useIsFetching: jest.fn(),
  useIsMutating: jest.fn()
}));

// typed props for mocked child components
interface OtpValidationProps {
  setNextStep: (step: FORGOT_PWD_STEP) => void;
  setupToken: (token: string) => void;
}

interface ResetPasswordFormProps {
  handleSuccess: () => void;
}

// Mock child components
jest.mock("../ForgotPassword", () => ({
  __esModule: true,
  default: ({
    setNextStep,
    setEmail
  }: {
    setNextStep: (step: FORGOT_PWD_STEP) => void;
    setEmail: (email: string) => void;
  }) => (
    <div data-testid="forgot-otp-form">
      <button
        data-testid="set-email-and-step"
        onClick={() => {
          setEmail("test@example.com");
          setNextStep(FORGOT_PWD_STEP.VALIDATE_OTP);
        }}
      >
        Simulate ForgotOtpForm Success
      </button>
    </div>
  )
}));

jest.mock("../../OTPVerification/OTPVerification", () => ({
  OtpValidation: ({ setNextStep, setupToken }: OtpValidationProps) => (
    <div data-testid="otp-validation">
      <button
        data-testid="set-token-and-step"
        onClick={() => {
          setupToken("test-token");
          setNextStep(FORGOT_PWD_STEP.RESET);
        }}
      >
        Simulate OtpValidation Success
      </button>
    </div>
  )
}));

jest.mock("../../ResetPassword/ResetPassword", () => ({
  ResetPasswordForm: ({ handleSuccess }: ResetPasswordFormProps) => (
    <div data-testid="reset-password-form">
      <button data-testid="call-handle-success" onClick={handleSuccess}>
        Simulate ResetPasswordForm Success
      </button>
    </div>
  )
}));

describe("ForgotPasswordWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ForgotOtpForm initially", () => {
    const { container } = render(
      <MemoryRouter>
        <ForgotPasswordWrapper />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders OtpValidation after email is set and step is VALIDATE_OTP", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <ForgotPasswordWrapper />
      </MemoryRouter>
    );

    const button = screen.getByTestId("set-email-and-step");
    await user.click(button);

    expect(container).toMatchSnapshot();
    expect(screen.getByTestId("otp-validation")).toBeInTheDocument();
  });

  it("renders ResetPasswordForm after token is set and step is RESET", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <ForgotPasswordWrapper />
      </MemoryRouter>
    );

    // First, go to OTP step
    const forgotButton = screen.getByTestId("set-email-and-step");
    await user.click(forgotButton);

    // Then, go to reset step
    const otpButton = screen.getByTestId("set-token-and-step");
    await user.click(otpButton);

    expect(container).toMatchSnapshot();
    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
  });

  it("calls handleSuccess when ResetPasswordForm succeeds", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ForgotPasswordWrapper />
      </MemoryRouter>
    );

    // Navigate to reset step
    const forgotButton = screen.getByTestId("set-email-and-step");
    await user.click(forgotButton);
    const otpButton = screen.getByTestId("set-token-and-step");
    await user.click(otpButton);

    // Simulate success
    const resetButton = screen.getByTestId("call-handle-success");
    await user.click(resetButton);

    // component now navigates on success; ensure navigate was called
    expect(mockedNavigate).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
