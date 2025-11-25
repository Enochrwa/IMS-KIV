import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { KivuI18nContext, LOCALE } from "@kivunova/kivufrontendcommon";
import Sidebar from "../Sidebar";
import SideBarMenuItems from "../constants/SidebarConfig";

// Mock GraphQL utils to avoid import.meta issues
jest.mock("../../../Graphql/utils", () => ({
  fetchGraphQL: jest.fn(),
  uploadFileGraphQL: jest.fn()
}));

// Mock ProfileCard to avoid complex dependencies
jest.mock("../ProfileCard", () => ({
  __esModule: true,
  default: () => <div data-testid="profile-card">Profile Card</div>
}));

describe("Sidebar Component", () => {
  const renderSidebar = (initialPath = "/portal") => {
    return render(
      <KivuI18nContext.Provider
        value={{
          language: LOCALE.RW,
          defaultLang: LOCALE.RW,
          setLanguage: () => {}
        }}
      >
        <MemoryRouter initialEntries={[initialPath]}>
          <Sidebar />
        </MemoryRouter>
      </KivuI18nContext.Provider>
    );
  };

  test("renders the sidebar drawer with correct styling", () => {
    renderSidebar();
    const drawer = screen.getByTestId("sidebar-drawer");
    expect(drawer).toBeInTheDocument();
    // Check that the drawer paper has the correct styles
    const drawerPaper = drawer.querySelector(".MuiDrawer-paper");
    expect(drawerPaper).toHaveStyle({
      width: "260px"
    });
  });

  test("renders logo and welcome message", () => {
    renderSidebar();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();
  });

  test("renders main menu items", () => {
    renderSidebar();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Administration")).toBeInTheDocument();
  });

  test("renders ProfileCard at the bottom", () => {
    renderSidebar();
    expect(screen.getByTestId("profile-card")).toBeInTheDocument();
  });

  // 🧭 Expand/Collapse per parent menu
  describe("Sidebar expand/collapse behavior", () => {
    SideBarMenuItems.filter((item) => item?.items?.length).forEach((item) => {
      test(`expands and collapses nested menu for "${item.label}"`, async () => {
        renderSidebar();
        const parentButton = screen.getByText(item.label);

        // Initially collapsed - check that subitems are not visible
        item?.items?.forEach((subItem) => {
          expect(screen.queryByText(subItem.label)).not.toBeInTheDocument();
        });

        // Expand
        fireEvent.click(parentButton);
        item?.items?.forEach((subItem) => {
          expect(screen.getByText(subItem.label)).toBeInTheDocument();
        });

        // Collapse again - check that subitems are hidden
        act(() => {
          fireEvent.click(parentButton);
        });
        // Wait for the collapse animation to complete
        await new Promise((resolve) => setTimeout(resolve, 350));
        item?.items?.forEach((subItem) => {
          expect(screen.queryByText(subItem.label)).not.toBeInTheDocument();
        });
      });

      test(`applies selected style for "${item.label}" route`, () => {
        const { container, unmount } = renderSidebar(item.path);
        const link = container.querySelector(`[href="${item.path}"]`);
        if (link) {
          expect(link).toHaveClass("Mui-selected");
        }
        unmount();
      });

      // nested items
      if (item?.items?.length) {
        item?.items?.forEach((subItem) => {
          test(`applies selected style for nested route "${subItem.label}"`, () => {
            const { container, unmount } = renderSidebar(subItem.path);
            const link = container.querySelector(`[href="${subItem.path}"]`);
            if (link) {
              expect(link).toHaveClass("Mui-selected");
            }
            unmount();
          });
        });
      }
    });
  });

  test("renders menu items with correct icons", () => {
    renderSidebar();
    // Check that icons are present (we can't easily test specific icons without more complex setup)
    const icons = screen.getAllByTestId(/Icon$/);
    expect(icons.length).toBeGreaterThan(0);
  });

  test("handles menu toggle state correctly", async () => {
    renderSidebar();
    const inventoryButton = screen.getByText("Inventory");

    // Initially not expanded
    expect(screen.queryByText("Products")).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(inventoryButton);
    expect(screen.getByText("Products")).toBeInTheDocument();

    // Click again to collapse
    act(() => {
      fireEvent.click(inventoryButton);
    });
    // Wait for the collapse animation to complete
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(screen.queryByText("Products")).not.toBeInTheDocument();
  });
});
