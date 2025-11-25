import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RegistrationData } from "../../components/Registration/types/registrationTypes";
import { defaultRegistrationValues } from "../../components/Registration/constants/registrationConstants";

export interface RegistrationState {
  registrationFormData: RegistrationData;
}

export const initialRegistrationState: RegistrationState = {
  registrationFormData: defaultRegistrationValues
};

// TODO: this is a sample slice. please update based on your use case
export const registrationSlice = createSlice({
  name: "jobFilter",
  initialState: initialRegistrationState,
  reducers: {
    setFormData: (state, action: PayloadAction<RegistrationData>) => {
      state.registrationFormData = { ...action.payload };
    },
    resetFormData: (state) => {
      state.registrationFormData =
        initialRegistrationState.registrationFormData;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setFormData, resetFormData } = registrationSlice.actions;

export default registrationSlice.reducer;
