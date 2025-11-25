export interface RegisterResponse {
  register: {
    userId: string;
  };
}

export interface AdminRequestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profileImage: string;
}

export interface CompanyRequestInfo {
  name: string;
  businessType: string;
  currencyCode: string;
  registrationNumber: string;
  description: string;
  address: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    streetAddress: string;
    country: string;
  };
}

export interface StoreRequestInfo {
  name: string;
  address: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    streetAddress: string;
    country: string;
  };
}

export interface RegisterRequest {
  company: CompanyRequestInfo;
  admin: AdminRequestInfo;
  store: StoreRequestInfo;
}
