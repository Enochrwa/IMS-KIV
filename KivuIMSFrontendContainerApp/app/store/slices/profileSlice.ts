import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  CompanyData,
  ProfileData
} from "../../components/Profile/types/profileTypes";

export interface ProfileState {
  profileData?: ProfileData;
  companyData?: CompanyData;
}

export const initialProfileState: ProfileState = {
  companyData: {
    id: "cmp-12345",
    name: "Kivunova Technologies Ltd",
    businessType: "Software Development",
    currencyCode: "USD",
    registrationNumber: "REG-2025-00123",
    description:
      "Kivunova Technologies is a tech innovation company specializing in AI-driven industrial design, inventory management, and digital transformation solutions across Africa and beyond.",
    address: {
      country: "Rwanda",
      province: "Northern Province",
      district: "Musanze",
      sector: "Muhoza",
      cell: "Cyabagarura",
      village: "Kivumu",
      streetAddress: "KN 45 Street, Plot 12"
    }
  }
};

export const profileSlice = createSlice({
  name: "profileSlice",
  initialState: initialProfileState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileData>) => {
      state.profileData = { ...action.payload };
    },
    resetProfileData: (state) => {
      state.profileData = initialProfileState.profileData;
    },
    setCompanyData: (state, action: PayloadAction<CompanyData>) => {
      state.companyData = { ...action.payload };
    },
    resetCompanyData: (state) => {
      state.companyData = initialProfileState.companyData;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setProfileData,
  resetProfileData,
  setCompanyData,
  resetCompanyData
} = profileSlice.actions;

export default profileSlice.reducer;
