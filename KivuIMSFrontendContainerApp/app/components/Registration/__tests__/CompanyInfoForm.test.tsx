import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import CompanyInfoForm from "../CompanyInfoForm";
import { RegistrationData } from "../types/registrationTypes";
import {
  useRwandaLocation,
  useKivunovaTranslation,
  CountryFullName
} from "@kivunova/kivufrontendcommon";

// 🧩 Mock hooks
jest.mock("@kivunova/kivufrontendcommon", () => ({
  ...jest.requireActual("@kivunova/kivufrontendcommon"),
  useRwandaLocation: jest.fn(),
  useKivunovaTranslation: jest.fn()
}));

const mockUseRwandaLocation = useRwandaLocation as jest.Mock;
const mockUseKivunovaTranslation = useKivunovaTranslation as jest.Mock;

const Wrapper = () => {
  const { control, formState, watch, setValue } = useForm<RegistrationData>({
    defaultValues: {
      company: {
        name: "",
        businessType: "",
        registrationNumber: "",
        currencyCode: "RWF",
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
    <CompanyInfoForm
      control={control}
      errors={formState.errors}
      watch={watch}
      setValue={setValue}
    />
  );
};

describe("CompanyInfoForm (unit)", () => {
  beforeEach(() => {
    mockUseKivunovaTranslation.mockReturnValue({
      t: (_k: string, fallback: string) => fallback
    });
    mockUseRwandaLocation.mockReturnValue({
      getProvinces: () => ["Kigali City"],
      getDistrictByProvince: () => ["Nyarugenge"],
      getSectors: () => ["Gitega"],
      getCells: () => ["Rugarama"],
      getVillages: () => ["Kabeza"],
      loading: false
    });
  });

  it("renders provinces and updates when province changes", () => {
    render(<Wrapper />);
    const provinceSelect = screen.getByLabelText("Province");
    fireEvent.mouseDown(provinceSelect);
    const provOption = screen.getByRole("option", {
      name: "Kigali City"
    });
    fireEvent.click(provOption);
    expect(
      document.getElementById("registration-province-Kigali City")
    ).toBeInTheDocument();
  });

  it("renders districts after selecting a province", () => {
    render(<Wrapper />);
    const provinceSelect = screen.getByLabelText("Province");
    fireEvent.mouseDown(provinceSelect);
    const provOption = document.getElementById(
      "registration-province-Kigali City"
    );
    fireEvent.click(provOption!);

    const districtSelect = screen.getByLabelText("District");
    fireEvent.mouseDown(districtSelect);
    const distOption = document.getElementById(
      "registration-district-Nyarugenge"
    );
    fireEvent.click(distOption!);

    expect(distOption).toBeInTheDocument();
  });

  it("renders and updates currency code selection", () => {
    render(<Wrapper />);
    const currencySelect = screen.getByLabelText("Currency code");
    fireEvent.mouseDown(currencySelect);
    const ugxOption = document.getElementById("registration-currencyCode-UGX");
    if (ugxOption) fireEvent.click(ugxOption);
    expect(ugxOption).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<Wrapper />);
    expect(container).toMatchSnapshot();
  });
});
