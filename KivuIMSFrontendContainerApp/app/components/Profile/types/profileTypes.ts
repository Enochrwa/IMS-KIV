// Base interface for profile data that can be updated
import { ReactNode } from "react";
import { AccountStatus, UserRole } from "../enums/profileEnums";
import { CompanyInfo } from "../../Registration/types/registrationTypes";

export interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  profileImage?: string;
}

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  role: UserRole;
  accountStatus: AccountStatus;
}

export interface PasswordChangeResponse {
  success: boolean;
  message?: string;
}

export interface GetProfileResponse {
  getProfile: {
    code: string;
    user: ProfileData;
  };
}

export interface UpdateProfileResponse {
  updateProfile: ProfileData;
}

export interface ChangePasswordResponse {
  changePassword: PasswordChangeResponse;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UploadProfileImageResponse {
  uploadProfileImage: {
    success: boolean;
    message: string;
    imageUrl: string;
  };
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileTabConfig {
  id: number;
  labelKey: string;
  defaultLabel: string;
  ariaControls: string;
  content: ReactNode;
}

export interface CompanyData extends CompanyInfo {
  id: string;
}

export interface GetCompanyResponse {
  getCompany: CompanyData;
}

export interface UpdateCompanyResponse {
  updateCompany: CompanyData;
}
