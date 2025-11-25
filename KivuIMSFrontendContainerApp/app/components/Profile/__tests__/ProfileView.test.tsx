import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import ProfileView from "../ProfileView";
import {
  resetProfileData,
  setProfileData
} from "../../../store/slices/profileSlice"; // adjust import to your actual reducer path
import { store } from "../../../store/store";
import { ProfileData } from "../types/profileTypes";
import { AccountStatus, UserRole } from "../enums/profileEnums";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../Graphql/utils", () => ({
  fetchGraphQL: jest.fn()
}));

describe("ProfileView Component", () => {
  const queryClient = new QueryClient();
  const mockProfileData: ProfileData = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    profileImage: "https://example.com/avatar.jpg",
    role: UserRole.ANALYST,
    accountStatus: AccountStatus.ACTIVE
  };

  beforeEach(() => {
    store.dispatch({ type: "profile/reset" });
  });

  it("renders profile details correctly", () => {
    store.dispatch(setProfileData(mockProfileData));

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ProfileView />
        </Provider>
      </QueryClientProvider>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(UserRole.ANALYST)).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("renders default values when some fields are missing", () => {
    const incompleteProfile = {
      ...mockProfileData,
      role: undefined,
      profileImage: ""
    } as unknown as ProfileData;
    store.dispatch(setProfileData(incompleteProfile));

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ProfileView />
        </Provider>
      </QueryClientProvider>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/No role assigned/i)).toBeInTheDocument();
  });

  it("renders Edit Profile button and opens modal when clicked", () => {
    store.dispatch(setProfileData(mockProfileData));
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ProfileView />
        </Provider>
      </QueryClientProvider>
    );

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    expect(screen.getByText("Edit your profile"));
  });

  it("handles missing profileData gracefully", () => {
    store.dispatch(resetProfileData());

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ProfileView />
        </Provider>
      </QueryClientProvider>
    );

    expect(container.firstChild).toBeNull();
  });
});
