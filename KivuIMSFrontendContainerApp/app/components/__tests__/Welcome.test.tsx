import React from "react";
import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Welcome from "../Welcome";
import { PAGE_ROUTE_LOGIN } from "../../PageRoutes";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, def?: string) => def || key,
    i18n: { changeLanguage: jest.fn(), language: "en" }
  })
}));

jest.mock("@kivunova/kivufrontendcommon", () => ({
  useKivunovaTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" }
  }),
  KivuI18nContext: React.createContext({ language: "en", defaultLang: "en" }),
  localizedPath: (p: string) => p
}));

describe("Welcome Component", () => {
  test("renders logo, heading, description, and button", () => {
    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>
    );

    // Logo
    const logo = screen.getByAltText(/Kivu IMS Logo/i);
    expect(logo).toBeInTheDocument();

    // Heading (use i18n key text during tests)
    const heading = screen.getByText(/welcome-to-ims-heading-text/i);
    expect(heading).toBeInTheDocument();

    // Description
    const description = screen.getByText(/welcome-to-ims-intro-text/i);
    expect(description).toBeInTheDocument();

    // Button
    const button = screen.getByRole("button", { name: /get-started-button/i });
    expect(button).toBeInTheDocument();
  });

  test("navigates to login page on button click", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path={PAGE_ROUTE_LOGIN} element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /get-started-button/i });
    await user.click(button);

    // Check if login page is rendered
    const loginPageText = await screen.findByText(/Login Page/i);
    expect(loginPageText).toBeInTheDocument();
  });
});
