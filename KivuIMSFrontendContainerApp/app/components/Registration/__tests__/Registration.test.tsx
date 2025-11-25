import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import registrationReducer from "../../../store/slices/registrationSlice";
import Registration from "../Registration";
import { defaultRegistrationValues } from "../constants/registrationConstants";
import type { RegistrationData } from "../types/registrationTypes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as yup from "yup";

// 👇 Mock the AuthRightSidePanel to avoid LOCALE issues
jest.mock("../../common/AuthSidePanel/AuthRightSidePanel", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-auth-right-panel">{children}</div>
  )
}));

// ✅ mock the real store import so we never use the frozen app store
jest.mock("../../../store/store", () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({}))
  }
}));

jest.mock("../../../Graphql/utils", () => ({
  fetchGraphQL: jest.fn(() =>
    Promise.resolve({ data: { registerUser: { success: true } } })
  )
}));

// 🧩 mocks for external libs
jest.mock("@kivunova/kivufrontendcommon", () => ({
  __esModule: true,
  useKivunovaTranslation: () => ({ t: (_: string, def?: string) => def || _ }),
  KivuI18nContext: React.createContext({ language: "en", defaultLang: "en" }),
  KivuEnvConfigContext: React.createContext({ countryCode: "RW" }),
  COUNTRY_CODE: {
    RWANDA: "RW"
  },
  CountryFullName: {
    RW: "Rwanda"
  },
  PhoneCountryCodeMap: {
    RW: { name: "Rwanda", dialCode: "+250", iso2: "RW" },
    US: { name: "United States", dialCode: "+1", iso2: "US" }
  },
  SupportedCurrencyCountryMap: {
    RW: {
      code: "RWF",
      label: "Rwandan Franc",
      labelTranslationKey: "currency-rwandan-franc"
    }
  },
  localizedPath: (path: string) => path,
  useRwandaLocation: () => ({
    getProvinces: () => ["Kigali City"],
    getDistrictByProvince: () => ["Nyarugenge"],
    getSectors: () => ["Gitega"],
    getCells: () => ["Cell A"],
    getVillages: () => ["Village 1"],
    loading: false
  })
}));

// 🧩 mock util
jest.mock("../utils/registrationUtils", () => ({
  hasStoreInfo: jest.fn(() => false),
  getRegistrationAdminSchema: jest.fn((t) =>
    yup.object({
      country: yup
        .string()
        .required(t("country-required-error-message", "Country is required")),
      province: yup
        .string()
        .required(t("province-required-error-message", "Province is required"))
    })
  ),
  getRegistrationStoreSchema: jest.fn((t) =>
    yup.object({
      country: yup
        .string()
        .required(t("country-required-error-message", "Country is required")),
      province: yup
        .string()
        .required(t("province-required-error-message", "Province is required"))
    })
  ),
  getRegistrationCompanySchema: jest.fn((t) =>
    yup.object({
      country: yup
        .string()
        .required(t("country-required-error-message", "Country is required")),
      province: yup
        .string()
        .required(t("province-required-error-message", "Province is required"))
    })
  ),
  getRegistrationAddressSchema: jest.fn((t) =>
    yup.object({
      country: yup
        .string()
        .required(t("country-required-error-message", "Country is required")),
      province: yup
        .string()
        .required(t("province-required-error-message", "Province is required"))
    })
  )
}));

// ✅ use a local mock store for tests
const createTestStore = (
  mockData: RegistrationData = defaultRegistrationValues
) =>
  configureStore({
    reducer: { registration: registrationReducer },
    preloadedState: {
      registration: { registrationFormData: mockData }
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false // unfrozen test store
      })
  });

const queryClient = new QueryClient();

// 🧰 render helper
const renderWithStore = (mockData?: RegistrationData) => {
  const testStore = createTestStore(mockData);
  return {
    store: testStore,
    ...render(
      <QueryClientProvider client={queryClient}>
        <Provider store={testStore}>
          <MemoryRouter>
            <Registration />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    )
  };
};

// 🧪 tests
describe("Registration (unit)", () => {
  it("renders initial step with Admin form", () => {
    const { asFragment } = renderWithStore();
    expect(asFragment()).toMatchSnapshot();
  });
});
