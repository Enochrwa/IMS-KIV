import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthContext from "../../../context/authContext";
import { AUTH_STATUS } from "../../../context/enums/authEnums";
import Login from "../Login";
import { LoginFormProps } from "../LoginForm";

// Mock children components
jest.mock("../../common/AuthSidePanel/AuthSidePanel", () =>
  // eslint-disable-next-line react/display-name
  () => <div data-testid="auth-side-panel">SidePanel</div>
);

jest.mock("../../common/AuthSidePanel/AuthRightSidePanel", () =>
  // eslint-disable-next-line react/display-name, react/prop-types
  ({ children }) => <div data-testid="auth-right-panel">{children}</div>
);

jest.mock("../LoginForm", () =>
  // eslint-disable-next-line react/display-name, react/prop-types
  ({ setLoginInfo }) => (
    <div data-testid="login-form">
      Login Form
      <button onClick={() => setLoginInfo("test@example.com")}>
        setLoginInfo
      </button>
    </div>
  )
);

jest.mock("../../common/OtpVerification/OtpVerification", () =>
  // eslint-disable-next-line react/display-name, react/prop-types
  ({ otpType, onBackToLogin, onVerifySuccess, loginInfo }) => (
    <div data-testid="otp-verification">
      OTP Verification - {otpType} - {loginInfo}
      <button onClick={onBackToLogin}>back</button>
      <button onClick={onVerifySuccess}>success</button>
    </div>
  )
);

const wrapper = (contextValue: LoginFormProps) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      <Login />
    </AuthContext.Provider>
  );
};

describe("<Login />", () => {
  test("renders LoginForm by default", () => {
    const mockUpdate = jest.fn();

    wrapper({
      authContextInfo: { auth: { status: AUTH_STATUS.UNAUTHENTICATED } },
      updateAuthContextInfo: mockUpdate
    });

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.queryByTestId("otp-verification")).not.toBeInTheDocument();
  });

  test("switches to OTP verification when status is VERIFY_EMAIL_REQUIRED and loginInfo is set", () => {
    const mockUpdate = jest.fn();

    const { asFragment } = wrapper({
      authContextInfo: { auth: { status: AUTH_STATUS.VERIFY_EMAIL_REQUIRED } },
      updateAuthContextInfo: mockUpdate
    });

    // simulate loginInfo being set through LoginForm
    fireEvent.click(screen.getByText("setLoginInfo"));

    expect(screen.getByTestId("otp-verification")).toBeInTheDocument();
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  test("backToLogin triggers updateAuthContextInfo", () => {
    const mockUpdate = jest.fn();

    wrapper({
      authContextInfo: { auth: { status: AUTH_STATUS.VERIFY_EMAIL_REQUIRED } },
      updateAuthContextInfo: mockUpdate
    });

    // simulate loginInfo to switch view
    fireEvent.click(screen.getByText("setLoginInfo"));

    // click back button inside OTP component
    fireEvent.click(screen.getByText("back"));

    expect(mockUpdate).toHaveBeenCalledWith({
      auth: { status: AUTH_STATUS.UNAUTHENTICATED }
    });
  });

  test("onVerifySuccess also calls backToLogin", () => {
    const mockUpdate = jest.fn();

    wrapper({
      authContextInfo: { auth: { status: AUTH_STATUS.VERIFY_EMAIL_REQUIRED } },
      updateAuthContextInfo: mockUpdate
    });

    fireEvent.click(screen.getByText("setLoginInfo"));

    fireEvent.click(screen.getByText("success"));

    expect(mockUpdate).toHaveBeenCalledWith({
      auth: { status: AUTH_STATUS.UNAUTHENTICATED }
    });
  });
});
