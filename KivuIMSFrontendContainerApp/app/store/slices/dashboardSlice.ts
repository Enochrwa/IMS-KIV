import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { MetricTimeRange } from "../../components/Dashboard/types/dashboardTypes";

export interface DashboardState {
  metricTimeRange: MetricTimeRange;
}

export const initialDashboardState: DashboardState = {
  metricTimeRange: {
    startDate: new Date(),
    endDate: new Date()
  }
};

export const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState: initialDashboardState,
  reducers: {
    setMetricTimeRange: (state, action: PayloadAction<MetricTimeRange>) => {
      state.metricTimeRange = action.payload;
    },
    resetMetricTimeRange: (state) => {
      state.metricTimeRange = initialDashboardState.metricTimeRange;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setMetricTimeRange, resetMetricTimeRange } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
