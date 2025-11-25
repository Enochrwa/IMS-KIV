import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProfileCard from "../ProfileCard";
import { KivuI18nContext, LOCALE } from "@kivunova/kivufrontendcommon";
import { useGetProfile } from "../../../hooks/api/useProfile";
import { useNavigate } from "react-router-dom";
import { PAGE_PORTAL_PROFILE } from "../../../PageRoutes";
import { useSelector } from "react-redux";

jest.mock("../../../hooks/api/useProfile", () => ({
  useGetProfile: jest.fn()
}));

jest.mock("@kivunova/kivufrontendcommon", () => ({
  useKivunovaTranslation: () => ({ t: (_: string, def: string) => def }),
  PhoneCountryCodeMap: {
    RW: { flag: "🇷🇼", code: "+250" },
    UG: { flag: "🇺🇬", code: "+256" }
  },
  COUNTRY_CODE: { RWANDA: "RW" },
  CountryFullName: { RW: "Rwanda" },
  KivuI18nContext: React.createContext({ language: "en", defaultLang: "en" }),
  KivuEnvConfigContext: React.createContext({ countryCode: "RW" }),
  LOCALE: { EN: "en", RW: "rw" },
  localizedPath: (path: string) => `/${path}`
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn()
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn()
}));

const mockUseGetProfile = jest.mocked(useGetProfile);
const mockUseNavigate = jest.mocked(useNavigate);
const mockUseSelector = jest.mocked(useSelector);

const mockKivuI18nContext = {
  language: LOCALE.EN,
  defaultLang: LOCALE.EN,
  setLanguage: jest.fn()
};

const renderWithProviders = (component: React.ReactElement) =>
  render(
    <KivuI18nContext.Provider value={mockKivuI18nContext}>
      <MemoryRouter>{component}</MemoryRouter>
    </KivuI18nContext.Provider>
  );

describe("ProfileCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the user's profile data", () => {
    const mockProfileData = {
      profileImage: "/avatar.jpg",
      firstName: "John",
      lastName: "Doe",
      role: "Admin"
    };

    mockUseSelector.mockReturnValue({ profileData: mockProfileData });
    mockUseGetProfile.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
      error: null
    });

    const { asFragment } = renderWithProviders(<ProfileCard />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders fallback values when profile data is missing", () => {
    mockUseSelector.mockReturnValue({ profileData: undefined });
    mockUseGetProfile.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
      error: null
    });

    const { asFragment } = renderWithProviders(<ProfileCard />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("navigates to profile page when clicked", () => {
    const mockNavigate = jest.fn();
    mockUseNavigate.mockReturnValue(mockNavigate);

    const mockProfileData = {
      profileImage: "/avatar.jpg",
      firstName: "Jane",
      lastName: "Smith",
      role: "User"
    };

    mockUseSelector.mockReturnValue({ profileData: mockProfileData });
    mockUseGetProfile.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
      error: null
    });

    renderWithProviders(<ProfileCard />);

    const clickableArea = screen.getByRole("button", {
      name: "View profile details"
    });

    fireEvent.click(clickableArea);
    expect(mockNavigate).toHaveBeenCalledWith(`/${PAGE_PORTAL_PROFILE}`);
  });

  it("does not navigate when logout button is clicked", () => {
    const mockNavigate = jest.fn();
    mockUseNavigate.mockReturnValue(mockNavigate);

    const mockProfileData = {
      profileImage: "/avatar.jpg",
      firstName: "Jane",
      lastName: "Smith",
      role: "User"
    };

    mockUseSelector.mockReturnValue({ profileData: mockProfileData });
    mockUseGetProfile.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
      error: null
    });

    renderWithProviders(<ProfileCard />);

    const logoutButton = screen.getByLabelText("Logout");
    fireEvent.click(logoutButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
