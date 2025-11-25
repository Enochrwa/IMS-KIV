import { RegistrationData, StoreInfo } from "../types/registrationTypes";
import {
  AdminRequestInfo,
  CompanyRequestInfo,
  RegisterRequest,
  StoreRequestInfo
} from "../../../Graphql/types/register";
import * as yup from "yup";
import {
  COUNTRY_CODE,
  isValidPhoneNumberForCountry,
  PhoneCountryCodeMap
} from "@kivunova/kivufrontendcommon";
import { CountryCode } from "libphonenumber-js";

export const hasStoreInfo = (storeInfo: StoreInfo): boolean =>
  Object.values(storeInfo).every(
    (v) => v !== null && v !== undefined && String(v).trim() !== ""
  );

export const transformRegistrationToRequest = (
  data: RegistrationData
): RegisterRequest => {
  const { admin, company, store } = data;

  // Build admin payload (drop phoneCountryCode)
  const adminRequest: AdminRequestInfo = {
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    phone: admin.phone, // Already formatted with the country code before submission
    password: admin.password,
    profileImage: admin.profileImage
  };

  // Build company payload (omit country in address)
  const companyRequest: CompanyRequestInfo = {
    name: company.name,
    businessType: company.businessType,
    currencyCode: company.currencyCode,
    registrationNumber: company.registrationNumber,
    description: company.description,
    address: {
      province: company.address.province,
      district: company.address.district,
      sector: company.address.sector,
      cell: company.address.cell,
      village: company.address.village,
      streetAddress: company.address.streetAddress,
      country: company.address.country
    }
  };

  // Build store payload (omit country in address)
  const storeRequest: StoreRequestInfo = {
    name: store.name,
    address: {
      province: store.address.province,
      district: store.address.district,
      sector: store.address.sector,
      cell: store.address.cell,
      village: store.address.village,
      streetAddress: store.address.streetAddress,
      country: store.address.country
    }
  };

  return {
    admin: adminRequest,
    company: companyRequest,
    store: storeRequest
  };
};

export const getRegistrationAddressSchema = (
  t: (key: string, value: string, opt?: { [key: string]: string }) => string
) => {
  return yup.object({
    country: yup
      .string()
      .required(t("country-required-error-message", "Country is required")),
    province: yup
      .string()
      .required(t("province-required-error-message", "Province is required")),
    district: yup
      .string()
      .required(t("district-required-error-message", "District is required")),
    sector: yup
      .string()
      .required(t("sector-required-error-message", "Sector is required")),
    cell: yup
      .string()
      .required(t("cell-required-error-message", "Cell is required")),
    village: yup
      .string()
      .required(t("village-required-error-message", "Village is required")),
    streetAddress: yup
      .string()
      .required(
        t("street-address-required-error-message", "Street address is required")
      )
  });
};

export const getRegistrationAdminSchema = (
  t: (key: string, value: string, opt?: { [key: string]: string }) => string
) => {
  return yup.object({
    admin: yup.object({
      firstName: yup
        .string()
        .required(
          t("first-name-required-error-message", "First name is required")
        ),
      lastName: yup
        .string()
        .required(
          t("lastname-required-error-message", "Last name is required")
        ),
      phoneCountryCode: yup
        .string()
        .required(
          t(
            "phone-country-code-required-error-message",
            "Phone country code is required"
          )
        ),
      email: yup
        .string()
        .email(t("email-invalid-error-message", "Enter valid email"))
        .required(t("email-required-error-message", "Email is required")),
      phone: yup
        .string()
        .required(
          t("phone number-required-error-message", "Phone number is required")
        )
        .test(
          "is-valid-phone",
          t("phone-invalid-error-message", "Enter a valid phone number"),
          function (value) {
            if (!value) return false;
            // Obtain country code from sibling field if available, default to RW
            const { phoneCountryCode } = this.parent as {
              phoneCountryCode?: string;
            };

            const countryCode = phoneCountryCode
              ? PhoneCountryCodeMap[phoneCountryCode].code
              : COUNTRY_CODE.RWANDA;
            const code = phoneCountryCode || COUNTRY_CODE.RWANDA;

            try {
              return isValidPhoneNumberForCountry(
                value,
                code as CountryCode,
                countryCode
              );
            } catch (e) {
              // If the validator throws for unexpected input, fail validation rather
              // than letting the exception bubble up to the test harness.
              // eslint-disable-next-line no-console
              console.error("phone validation error:", e);
              return false;
            }
          }
        ),
      password: yup
        .string()
        .min(
          8,
          t(
            "password-invalid-error-message",
            "Password must be at least 8 characters"
          )
        )
        .required(t("password-required-error-message", "Password is required"))
    })
  });
};

export const getRegistrationCompanySchema = (
  t: (key: string, value: string, opt?: { [key: string]: string }) => string
) => {
  return yup.object({
    company: yup.object({
      name: yup
        .string()
        .required(
          t("company-name-required-error-message", "Company name is required")
        ),
      businessType: yup
        .string()
        .required(
          t("business-type-required-error-message", "Business type is required")
        ),
      currencyCode: yup
        .string()
        .required(
          t("currency-code-required-error-message", "Currency code is required")
        ),
      registrationNumber: yup
        .string()
        .required(
          t(
            "registration-number-required-error-message",
            "Registration number is required"
          )
        ),
      description: yup.string(),
      address: getRegistrationAddressSchema(t)
    })
  });
};

export const getRegistrationStoreSchema = (
  t: (key: string, value: string, opt?: { [key: string]: string }) => string
) => {
  return yup.object({
    store: yup.object({
      name: yup
        .string()
        .required(
          t("store-name-required-error-message", "Store name is required")
        ),
      address: getRegistrationAddressSchema(t)
    })
  });
};
