import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { sampleProfiles } from "../../components/Employees/constants/employees";
import { Employee } from "../../components/Employees/types/employees";

export interface EmployeeState {
  employeeList: Employee[];
  employeeDetail?: Employee;
}

export const initialEmployeeState: EmployeeState = {
  employeeList: sampleProfiles,
  employeeDetail: sampleProfiles[0]
};

// TODO: this is a sample slice. please update based on your use case
export const employeeSlice = createSlice({
  name: "employees",
  initialState: initialEmployeeState,
  reducers: {
    setEmployeeList: (state, action: PayloadAction<Employee[]>) => {
      state.employeeList = action.payload;
    },
    resetEmployeeList: (state) => {
      state.employeeList = initialEmployeeState.employeeList;
    },
    // add product list from pagination
    addEmployeeList: (state, action: PayloadAction<Employee[]>) => {
      state.employeeList = [...state.employeeList, ...action.payload];
    },
    setEmployeeDetail: (state, action: PayloadAction<Employee>) => {
      state.employeeDetail = action.payload;
    },
    resetEmployeeDetail: (state) => {
      state.employeeDetail = initialEmployeeState.employeeDetail;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setEmployeeList,
  setEmployeeDetail,
  resetEmployeeList,
  addEmployeeList,
  resetEmployeeDetail
} = employeeSlice.actions;

export default employeeSlice.reducer;
