import React from "react";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlertBannerProvider from "../../../providers/AlertBannerProvider";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../hooks/api/useResetPassword", () => ({
  __esModule: true,
  default: jest.fn()
}));

import useResetPassword from "../../../hooks/api/useResetPassword";
import { ResetPasswordForm } from "../ResetPassword";

jest.mock("@kivunova/kivufrontendcommon", () => ({
  __esModule: true,
  useKivunovaTranslation: () => ({ t: (k: string, d: string) => d }),
  KivuI18nContext: React.createContext({
    language: "en",
    defaultLang: "en"
  }),
  localizedPath: (p: string) => p
}));

const useResetPasswordMock = useResetPassword as jest.MockedFunction<
  typeof useResetPassword
>;

describe("ResetPasswordForm component", () => {
  beforeEach(() => jest.clearAllMocks());

  function renderWithProviders(props: {
    token: string;
    handleSuccess: jest.Mock;
  }) {
    const queryClient = new QueryClient();

    return render(
      <ResetPasswordForm
        token={props.token}
        handleSuccess={props.handleSuccess}
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

  it("renders form fields and submit button", () => {
    const mockReturn = {
      mutateAsync: jest.fn(),
      isPending: false
    } as unknown as ReturnType<typeof useResetPassword>;
    useResetPasswordMock.mockReturnValue(mockReturn);

    const handleSuccess = jest.fn();

    const { container } = renderWithProviders({
      token: "test-token",
      handleSuccess
    });

    expect(
      screen.getByTestId("reset-password-new-password")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reset-password-confirm-password")
    ).toBeInTheDocument();
    expect(screen.getByTestId("reset-password-submit")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("calls mutateAsync with token and newPassword on submit", async () => {
    const mutateAsync = jest.fn().mockResolvedValue({});
    const mockReturn = {
      mutateAsync,
      isPending: false
    } as unknown as ReturnType<typeof useResetPassword>;
    useResetPasswordMock.mockReturnValue(mockReturn);

    const handleSuccess = jest.fn();

    renderWithProviders({
      token: "test-token",
      handleSuccess
    });

    const user = userEvent.setup();

    const newPasswordInput = screen.getByTestId("reset-password-new-password");
    const confirmInput = screen.getByTestId("reset-password-confirm-password");
    await user.type(newPasswordInput, "password123");
    await user.type(confirmInput, "password123");

    const submit = screen.getByTestId("reset-password-submit");
    await user.click(submit);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync).toHaveBeenCalledWith({
      verificationToken: "test-token",
      newPassword: "password123"
    });

    await waitFor(() => expect(handleSuccess).toHaveBeenCalledTimes(1));
  });

  it("shows loading state when mutation is pending", () => {
    const mockReturn = {
      mutateAsync: jest.fn(),
      isPending: true
    } as unknown as ReturnType<typeof useResetPassword>;
    useResetPasswordMock.mockReturnValue(mockReturn);

    const handleSuccess = jest.fn();

    renderWithProviders({
      token: "test-token",
      handleSuccess
    });

    const submit = screen.getByTestId("reset-password-submit");
    expect(submit).toBeDisabled();
  });
});
