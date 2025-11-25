import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import AdminInfoForm from "../AdminInfoForm";
import { RegistrationData } from "../types/registrationTypes";

// 🧩 Mock @kivunova/kivufrontendcommon
jest.mock("@kivunova/kivufrontendcommon", () => ({
  __esModule: true,
  useKivunovaTranslation: () => ({
    t: (_: string, def?: string) => def || _
  }),
  KivuEnvConfigContext: React.createContext({ countryCode: "RW" }),
  PhoneCountryCodeMap: {
    RW: { code: "+250", countryCode: "RW", flag: "🇷🇼" },
    UG: { code: "+256", countryCode: "UG", flag: "🇺🇬" }
  }
}));

// 🧩 Helper: Wrapper with react-hook-form context
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Wrapper: React.FC<{ errors?: any }> = ({ errors }) => {
  const { control } = useForm<RegistrationData>({
    defaultValues: {
      admin: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "RW",
        password: ""
      }
    } as RegistrationData
  });

  return <AdminInfoForm control={control} errors={errors || {}} />;
};

describe("AdminInfoForm", () => {
  it("renders all admin input fields", () => {
    render(<Wrapper />);

    expect(screen.getByTestId("registration-firstName")).toBeInTheDocument();
    expect(screen.getByTestId("registration-lastName")).toBeInTheDocument();
    expect(screen.getByTestId("registration-email")).toBeInTheDocument();
    expect(screen.getByTestId("registration-phone")).toBeInTheDocument();
    expect(screen.getByTestId("registration-password")).toBeInTheDocument();
  });

  it("renders with default phone country code (🇷🇼 +250)", () => {
    render(<Wrapper />);

    const select = screen.getByLabelText("Country Code");
    expect(select).toBeInTheDocument();
    // RWANDA should be selected by default
    expect(select).toHaveTextContent("🇷🇼 (+250)");
  });

  it("renders error messages for invalid inputs", () => {
    const errors = {
      admin: {
        firstName: { message: "First name required" },
        email: { message: "Invalid email" },
        phone: { message: "Invalid phone number" },
        password: { message: "Password required" }
      }
    };

    render(<Wrapper errors={errors} />);

    expect(screen.getByText("First name required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    expect(screen.getByText("Invalid phone number")).toBeInTheDocument();
    expect(screen.getByText("Password required")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Wrapper />);
    expect(asFragment()).toMatchSnapshot();
  });
});
