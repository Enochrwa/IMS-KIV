import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import profileReducer from "../../../store/slices/profileSlice";
import "@testing-library/jest-dom";
import UserProfile from "../UserProfile";

// ✅ Mock translation
jest.mock("@kivunova/kivufrontendcommon", () => ({
  useKivunovaTranslation: () => ({ t: (_: string, def: string) => def })
}));

// ✅ Mock ProfileTabsConfig
jest.mock("../constants/ProfileTabConfig", () => ({
  ProfileTabsConfig: [
    {
      id: 0,
      labelKey: "overview",
      defaultLabel: "Overview",
      ariaControls: "panel-0",
      content: <div>Overview Content</div>
    },
    {
      id: 1,
      labelKey: "settings",
      defaultLabel: "Settings",
      ariaControls: "panel-1",
      content: <div>Settings Content</div>
    }
  ]
}));

// ✅ Mock GraphQL hook
const mockMutateAsync = jest.fn();
jest.mock("../../../hooks/api/useProfile", () => ({
  useGetProfile: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false
  })
}));

// ✅ Helper to create test store
const createTestStore = () =>
  configureStore({
    reducer: { profile: profileReducer }
  });

describe("UserProfile", () => {
  const queryClient = new QueryClient();

  const renderWithProviders = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={createTestStore()}>
          <UserProfile />
        </Provider>
      </QueryClientProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls mutateAsync and dispatches setProfileData", async () => {
    const mockProfile = {
      getProfile: { user: { id: "1", firstName: "John" } }
    };
    mockMutateAsync.mockResolvedValueOnce(mockProfile);

    renderWithProviders();

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    });
  });

  it("renders tabs and allows switching", async () => {
    const { asFragment } = renderWithProviders();

    // Tabs from ProfileTabsConfig
    const overviewTab = screen.getByRole("tab", { name: /Overview/i });
    const settingsTab = screen.getByRole("tab", { name: /Settings/i });

    expect(overviewTab).toBeInTheDocument();
    expect(settingsTab).toBeInTheDocument();

    // Default content
    expect(screen.getByText(/Overview Content/i)).toBeInTheDocument();

    // Switch tabs
    fireEvent.click(settingsTab);
    await waitFor(() => {
      expect(screen.getByText(/Settings Content/i)).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders ProfileSkeleton when loading", () => {
    // Override hook to simulate pending state
    jest
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      .spyOn(require("../../../hooks/api/useProfile"), "useGetProfile")
      .mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true
      });

    const { asFragment } = renderWithProviders();
    expect(screen.getByTestId("profile-skeleton")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
