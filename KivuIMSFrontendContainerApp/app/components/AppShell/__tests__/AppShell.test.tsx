import React from "react";
import { render, screen } from "@testing-library/react";
import AppShell from "../AppShell";
import "@testing-library/jest-dom";
import { KivuI18nContext, LOCALE } from "@kivunova/kivufrontendcommon";
import { MemoryRouter } from "react-router-dom";

jest.mock("@tanstack/react-query", () => ({
  useIsFetching: jest.fn(),
  useIsMutating: jest.fn()
}));

// Mock the Sidebar and Topbar components to isolate AppShell testing
jest.mock("../../Navigation/Sidebar", () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

jest.mock("../../Navigation/Topbar", () => ({
  __esModule: true,
  default: () => <div data-testid="topbar">Topbar</div>
}));

describe("AppShell Component", () => {
  const renderAppShell = (initialPath = "/portal") => {
    return render(
      <KivuI18nContext.Provider
        value={{
          language: LOCALE.RW,
          defaultLang: LOCALE.RW,
          setLanguage: () => {}
        }}
      >
        <MemoryRouter initialEntries={[initialPath]}>
          <AppShell />
        </MemoryRouter>
      </KivuI18nContext.Provider>
    );
  };

  test("matches snapshot", () => {
    const { asFragment } = renderAppShell();
    expect(asFragment()).toMatchSnapshot();
  });

  test("main content area has correct styling", () => {
    renderAppShell();

    // The main element should have flexGrow: 1, overflow: auto, p: 3, bgcolor: "#fafafa"
    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveStyle({
      flexGrow: 1,
      overflow: "auto",
      padding: "24px", // p: 3 in MUI is 24px
      backgroundColor: "#fafafa"
    });
  });
});
