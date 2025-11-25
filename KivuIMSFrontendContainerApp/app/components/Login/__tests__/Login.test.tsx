import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";

// 👇 Mock the AuthRightSidePanel to avoid LOCALE issues
jest.mock("../../common/AuthSidePanel/AuthRightSidePanel", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-auth-right-panel">{children}</div>
  )
}));

// Mock the translation hook and i18n context used in the component to avoid i18n warnings
jest.mock("@kivunova/kivufrontendcommon", () => {
  return {
    __esModule: true,
    useKivunovaTranslation: () => ({ t: (k: string, d?: string) => d || k }),
    KivuI18nContext: React.createContext({ language: "en", defaultLang: "en" }),
    localizedPath: (path: string) => `/${path}`
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// ✅ Mock useLogin hook
jest.mock("../../../hooks/api/useLogin", () => ({
  __esModule: true,
  default: () => ({
    isPending: false,
    mutateAsync: jest.fn().mockResolvedValue({})
  })
}));

jest.mock("@tanstack/react-query", () => ({
  useIsFetching: jest.fn(),
  useIsMutating: jest.fn()
}));

// Helper to wrap components that use react-router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login UI Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all main elements", () => {
    const { asFragment } = renderWithRouter(<Login />);

    // Capture snapshot to detect unintended DOM regressions
    expect(asFragment()).toMatchSnapshot();

    // Also check main elements by test id to keep the test stable across styling changes
    expect(screen.getByTestId("auth-left-panel")).toBeInTheDocument();
    expect(screen.getByTestId("login-right-panel")).toBeInTheDocument();
    expect(screen.getByTestId("auth-logo")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("login-email")).toBeInTheDocument();
    expect(screen.getByTestId("login-password")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
  });

  it("can type into inputs and check checkbox", async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByTestId("login-email") as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      "login-password"
    ) as HTMLInputElement;
    const rememberCheckbox = screen.getByTestId(
      "login-remember"
    ) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(rememberCheckbox);
    });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(rememberCheckbox.checked).toBe(true);
  });

  it("submit button logs form values", async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByTestId("login-email") as HTMLInputElement;
    const passwordInput = screen.getByTestId(
      "login-password"
    ) as HTMLInputElement;
    const rememberCheckbox = screen.getByTestId(
      "login-remember"
    ) as HTMLInputElement;
    const submitButton = screen.getByTestId("login-submit");

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(rememberCheckbox);
      fireEvent.click(submitButton);
    });

    // No console output expected in production UI handler; ensure inputs keep values
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(rememberCheckbox.checked).toBe(true);
  });
});
