import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import profileReducer from "../../../store/slices/profileSlice";
import ProfileEditForm from "../ProfileEditForm";
import "@testing-library/jest-dom";
import { ProfileData } from "../types/profileTypes";

// ✅ Keep full mock
jest.mock("@kivunova/kivufrontendcommon", () => ({
  useKivunovaTranslation: () => ({ t: (_: string, def: string) => def }),
  PhoneCountryCodeMap: {
    RW: { flag: "🇷🇼", code: "+250" },
    UG: { flag: "🇺🇬", code: "+256" }
  },
  COUNTRY_CODE: { RWANDA: "RW" },
  CountryFullName: { RW: "Rwanda" }
}));

// ✅ Mock GraphQL hook
const mockMutateAsync = jest.fn().mockResolvedValue({
  updateProfile: { id: "1", firstName: "Updated", lastName: "User" }
});

jest.mock("../../../hooks/api/useProfile", () => ({
  useUpdateProfile: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false
  })
}));

// ✅ Create lightweight store
const createTestStore = (preloadedState: object) =>
  configureStore({
    reducer: { profile: profileReducer },
    preloadedState: { profile: preloadedState || {} }
  });

describe("ProfileEditForm", () => {
  const queryClient = new QueryClient();

  const renderWithProviders = (
    profileData?: ProfileData,
    onClose = jest.fn()
  ) => {
    const store = createTestStore({
      profileData: profileData || { phoneCountryCode: "" }
    });

    const utils = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ProfileEditForm onClose={onClose} />
        </Provider>
      </QueryClientProvider>
    );

    return { ...utils, store };
  };

  const mockProfile = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    phoneCountryCode: "RW"
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders all form fields correctly", () => {
    const { asFragment } = renderWithProviders(
      mockProfile as unknown as ProfileData
    );

    expect(screen.getByLabelText(/First Name/i)).toHaveValue("John");
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("Doe");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("john.doe@example.com");
    expect(screen.getByLabelText(/Phone/i)).toHaveValue("1234567890");

    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose when Cancel button is clicked", () => {
    const onClose = jest.fn();
    renderWithProviders(mockProfile as unknown as ProfileData, onClose);
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
