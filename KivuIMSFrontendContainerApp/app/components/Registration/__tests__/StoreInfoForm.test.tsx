import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StoreInfoForm from "../StoreInfoForm";
import { RegistrationData } from "../types/registrationTypes";
import { useForm } from "react-hook-form";
import {
  useKivunovaTranslation,
  useRwandaLocation,
  CountryFullName
} from "@kivunova/kivufrontendcommon";

// ✅ Mock translation hook
jest.mock("@kivunova/kivufrontendcommon", () => ({
  ...jest.requireActual("@kivunova/kivufrontendcommon"),
  useKivunovaTranslation: jest.fn(),
  useRwandaLocation: jest.fn()
}));

const mockUseKivunovaTranslation = useKivunovaTranslation as jest.Mock;
const mockUseRwandaLocation = useRwandaLocation as jest.Mock;

describe("StoreInfoForm (unit)", () => {
  const Wrapper = () => {
    const methods = useForm<RegistrationData>({
      defaultValues: {
        store: {
          name: "",
          address: {
            country: CountryFullName.RW,
            province: "",
            district: "",
            sector: "",
            cell: "",
            village: "",
            streetAddress: ""
          }
        }
      }
    });

    return (
      <StoreInfoForm
        control={methods.control}
        errors={{}}
        watch={methods.watch}
        setValue={methods.setValue}
      />
    );
  };

  beforeEach(() => {
    mockUseKivunovaTranslation.mockReturnValue({
      t: (_k: string, fallback: string) => fallback
    });

    mockUseRwandaLocation.mockReturnValue({
      getProvinces: () => ["Kigali City", "Northern Province"],
      getDistrictByProvince: (prov: string) =>
        prov === "Kigali City" ? ["Nyarugenge", "Gasabo"] : ["Musanze"],
      getSectors: (_p: string, dist: string) =>
        dist === "Nyarugenge" ? ["Gitega", "Kigali"] : ["Sector A"],
      getCells: () => ["Cell1"],
      getVillages: () => ["Village1"],
      loading: false
    });
  });

  it("renders the main input and select fields", () => {
    render(<Wrapper />);

    // Verify Store Name field
    expect(screen.getByTestId("registration-storeName")).toBeInTheDocument();

    // Verify Country select is rendered and disabled
    const countrySelect = screen.getByLabelText("Country");
    expect(countrySelect).toBeInTheDocument();

    // Province dropdown should render options
    expect(screen.getByLabelText("Province")).toBeInTheDocument();
  });

  it("renders province options and updates district list when province selected", () => {
    render(<Wrapper />);

    const provinceSelect = screen.getByLabelText("Province");

    // Open province dropdown
    fireEvent.mouseDown(provinceSelect);
    const option = screen.getByText("Kigali City");
    fireEvent.click(option);

    // After selecting Kigali City, the District select should appear
    expect(screen.getByLabelText("District")).toBeInTheDocument();

    // Open District dropdown
    const districtSelect = screen.getByLabelText("District");
    fireEvent.mouseDown(districtSelect);
    const districtOption = screen.getByText("Nyarugenge");
    fireEvent.click(districtOption);

    // Now Sector select should appear
    expect(screen.getByLabelText("Sector")).toBeInTheDocument();
  });

  it("renders subsequent selects when previous selections are made", () => {
    render(<Wrapper />);

    const provinceSelect = screen.getByLabelText("Province");
    fireEvent.mouseDown(provinceSelect);
    fireEvent.click(screen.getByText("Kigali City"));

    const districtSelect = screen.getByLabelText("District");
    fireEvent.mouseDown(districtSelect);
    fireEvent.click(screen.getByText("Nyarugenge"));

    const sectorSelect = screen.getByLabelText("Sector");
    fireEvent.mouseDown(sectorSelect);
    fireEvent.click(screen.getByText("Gitega"));

    // After selecting Sector, the Cell select should appear
    expect(screen.getByLabelText("Cell")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<Wrapper />);
    expect(container).toMatchSnapshot();
  });
});
