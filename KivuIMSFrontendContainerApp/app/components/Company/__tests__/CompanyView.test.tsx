import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CompanyView from "../CompanyView";
import profileReducer from "../../../store/slices/profileSlice";
import { CompanyData } from "../../Profile/types/profileTypes";

// ✅ Mock translation
jest.mock("@kivunova/kivufrontendcommon", () => ({
  useKivunovaTranslation: () => ({ t: (_: string, def: string) => def })
}));

jest.mock("../CompanyEditForm", () => {
  const MockCompanyEditForm = (props: { onClose: () => void }) => (
    <div data-testid="company-edit-form">
      <button onClick={props.onClose}>Close Form</button>
    </div>
  );
  MockCompanyEditForm.displayName = "MockCompanyEditForm";
  return MockCompanyEditForm;
});

// ✅ Helper: make test store with optional companyData
const makeStore = (companyData?: CompanyData) =>
  configureStore({
    reducer: { profile: profileReducer },
    preloadedState: {
      profile: { companyData }
    }
  });

// ✅ Mock data
const mockCompany = {
  name: "Kivunova Ltd",
  businessType: "Technology",
  currencyCode: "RWF",
  registrationNumber: "REG-123",
  description: "Leading software company",
  address: {
    country: "Rwanda",
    province: "Northern",
    district: "Musanze",
    sector: "Muhoza",
    cell: "Kigali",
    village: "Nyirangarama",
    streetAddress: "Main Street 12"
  }
} as CompanyData;

describe("CompanyView", () => {
  it("renders nothing when companyData is missing", () => {
    const store = makeStore(undefined);
    const { container } = render(
      <Provider store={store}>
        <CompanyView />
      </Provider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders all company fields correctly", () => {
    const store = makeStore(mockCompany);
    render(
      <Provider store={store}>
        <CompanyView />
      </Provider>
    );

    expect(screen.getByText("Company Information")).toBeInTheDocument();
    expect(screen.getByText("Company Details")).toBeInTheDocument();
    expect(screen.getByText("Kivunova Ltd")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("RWF")).toBeInTheDocument();
    expect(screen.getByText("REG-123")).toBeInTheDocument();
    expect(screen.getByText("Company Address")).toBeInTheDocument();
    expect(screen.getByText("Rwanda")).toBeInTheDocument();
    expect(screen.getByText("Leading software company")).toBeInTheDocument();
  });

  it("opens and closes modal when clicking Edit Company and Close icon", async () => {
    const store = makeStore(mockCompany);
    render(
      <Provider store={store}>
        <CompanyView />
      </Provider>
    );

    const editBtn = screen.getByRole("button", { name: "Edit Company" });
    fireEvent.click(editBtn);

    // Modal open
    expect(await screen.findByTestId("company-edit-form")).toBeInTheDocument();

    // Simulate internal form closing
    fireEvent.click(screen.getByText("Close Form"));

    await waitFor(() =>
      expect(screen.queryByTestId("company-edit-form")).not.toBeInTheDocument()
    );
  });

  it("closes modal when clicking CloseIcon button", async () => {
    const store = makeStore(mockCompany);
    render(
      <Provider store={store}>
        <CompanyView />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit Company" }));

    const closeButtons = await screen.findAllByRole("button", {
      name: /Close/i
    });

    // Close icon is one of these
    fireEvent.click(closeButtons[0]);

    await waitFor(() =>
      expect(screen.queryByTestId("company-edit-form")).not.toBeInTheDocument()
    );
  });
});
