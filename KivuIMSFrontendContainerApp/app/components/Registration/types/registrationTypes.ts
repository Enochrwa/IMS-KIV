export interface AdminInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profileImage: string;
  phoneCountryCode: string;
}

export interface CompanyInfo {
  name: string;
  businessType: string;
  currencyCode: string;
  registrationNumber: string;
  description: string;
  address: {
    country: string;
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    streetAddress: string;
  };
}

export interface StoreInfo {
  name: string;
  address: {
    country: string;
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    streetAddress: string;
  };
}

export type RegistrationData = {
  company: CompanyInfo;
  admin: AdminInfo;
  store: StoreInfo;
};

export interface RegistrationStepConfigItem {
  title: string;
  titleTranslationKey: string;
  labelText: string;
  labelTranslationKey: string;
}
