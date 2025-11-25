import React from "react";
import { render, screen } from "@testing-library/react";
import ReviewAndSubmit from "../ReviewAndSubmit";
import { RegistrationData } from "../types/registrationTypes";
import {
  COUNTRY_CODE,
  useKivunovaTranslation
} from "@kivunova/kivufrontendcommon";

// ✅ Mock translation hook
jest.mock("@kivunova/kivufrontendcommon", () => ({
  ...jest.requireActual("@kivunova/kivufrontendcommon"),
  useKivunovaTranslation: jest.fn()
}));

const mockUseKivunovaTranslation = useKivunovaTranslation as jest.Mock;

// ✅ Full registration data (required fields filled)
const mockData: RegistrationData = {
  admin: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "supersecret",
    phone: "+250788000111",
    profileImage: "",
    phoneCountryCode: COUNTRY_CODE.RWANDA
  },
  company: {
    name: "Kivunova",
    businessType: "Tech",
    registrationNumber: "RN1234",
    description: "Software company",
    address: {
      country: "Rwanda",
      province: "Kigali City",
      district: "Nyarugenge",
      sector: "Gitega",
      cell: "Rugarama",
      village: "Kabeza",
      streetAddress: "KG 11st 43"
    },
    currencyCode: "RWF"
  },
  store: {
    name: "Main Store",
    address: {
      country: "Rwanda",
      province: "Kigali City",
      district: "Nyarugenge",
      sector: "Gitega",
      cell: "Rugarama",
      village: "Kabeza",
      streetAddress: "KG 11st 43"
    }
  }
};

describe("ReviewAndSubmit (unit)", () => {
  beforeEach(() => {
    mockUseKivunovaTranslation.mockReturnValue({
      t: (key: string, fallback: string) => fallback || key
    });
  });

  it("renders all three sections with correct headers", () => {
    render(<ReviewAndSubmit allData={mockData} />);

    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    expect(screen.getByText("Company Info")).toBeInTheDocument();
    expect(screen.getByText("Store Info")).toBeInTheDocument();
  });

  it("renders masked password value", () => {
    render(<ReviewAndSubmit allData={mockData} />);
    expect(screen.getByText("********")).toBeInTheDocument();
  });

  it("renders all table rows for each section", () => {
    render(<ReviewAndSubmit allData={mockData} />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("matches snapshot", () => {
    const { container } = render(<ReviewAndSubmit allData={mockData} />);
    expect(container).toMatchSnapshot();
  });
});
