import {
  RegistrationData,
  RegistrationStepConfigItem
} from "../types/registrationTypes";
import { COUNTRY_CODE, CountryFullName } from "@kivunova/kivufrontendcommon";

export const RegistrationStepConfig: RegistrationStepConfigItem[] = [
  {
    titleTranslationKey: "registration-step-admin",
    title: "Personal Info",
    labelText: "Tell us about yourself to personalize your experience.",
    labelTranslationKey: "admin-info-title"
  },
  {
    titleTranslationKey: "registration-step-company",
    title: "Company Info",
    labelText: "Let’s learn more about your company",
    labelTranslationKey: "company-info-title"
  },
  {
    titleTranslationKey: "registration-step-store",
    title: "Store Info",
    labelText: "Let’s learn more about your store.",
    labelTranslationKey: "store-info-title"
  },
  {
    titleTranslationKey: "registration-step-review",
    title: "Review & Submit",
    labelText: "Take a moment to review your information — you’re almost done!",
    labelTranslationKey: "review-and-submit-info-title"
  }
];

export const defaultRegistrationValues: RegistrationData = {
  company: {
    name: "",
    // company
    businessType: "",
    currencyCode: COUNTRY_CODE.RWANDA,
    registrationNumber: "",
    description: "",
    address: {
      country: CountryFullName.RW,
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
      streetAddress: ""
    }
  },
  admin: {
    // admin
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    profileImage: "",
    phoneCountryCode: ""
  },
  // store
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
};
