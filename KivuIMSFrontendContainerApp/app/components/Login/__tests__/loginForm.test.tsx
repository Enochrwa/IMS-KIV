import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginForm, { LoginFormProps } from "../LoginForm";

jest.mock("@kivunova/kivufrontendcommon", () => ({
  __esModule: true,
  useKivunovaTranslation: () => ({
    t: (_key: string, fallback?: string) => fallback || _key
  }),
  localizedPath: jest.fn(() => "/forgot-password"),
  KivuI18nContext: React.createContext({
    language: "en",
    defaultLang: "en"
  })
}));

const mockMutateAsync = jest.fn();
jest.mock("../../../hooks/api/useLogin", () => ({
  __esModule: true,
  default: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false
  })
}));

const queryClient = new QueryClient();

const renderForm = (props?: LoginFormProps) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginForm setLoginInfo={props?.setLoginInfo || jest.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("LoginForm (unit)", () => {
  it("renders form snapshot", () => {
    const { asFragment } = renderForm();
    expect(asFragment()).toMatchSnapshot();
  });

  it("validates required fields", async () => {
    renderForm();

    fireEvent.click(screen.getByText("Log in"));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  it("validates password min length", async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "12345" }
    });
    fireEvent.click(screen.getByText("Log in"));

    expect(
      await screen.findByText("Password should be at least 8 characters")
    ).toBeInTheDocument();
  });

  it("calls setLoginInfo & login mutation on submit", async () => {
    const mockSetLoginInfo = jest.fn();
    mockMutateAsync.mockResolvedValueOnce({ success: true });

    renderForm({ setLoginInfo: mockSetLoginInfo });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@test.com" }
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" }
    });

    fireEvent.click(screen.getByText("Log in"));

    await waitFor(() => {
      expect(mockSetLoginInfo).toHaveBeenCalledWith("user@test.com");
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: "user@test.com",
        password: "password123"
      });
    });
  });
});
