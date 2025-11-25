import React, { useMemo } from "react";
import { Box, Stack, useTheme } from "@mui/material";
import { useDashboardData } from "../../hooks/api/useDashboardData";
import DashboardHeader from "./DashboardHeader";
import SalesVsInventoryChart from "./charts/SalesVsInventoryChart";
import InventoryMovementPie from "./charts/InventoryMovementPie";
import TopMovingCategoryChart from "./charts/TopMovingCategoryChart";
import MostSoldProductsChart from "./charts/MostSoldProductsChart";
import useMediaQuery from "@mui/material/useMediaQuery";
import MetricLedger from "../common/MetricLedger/MetricLedger";
import {
  generateSalesAndInventoryTrend,
  getMetricPeriodLabel
} from "./utils/metricsUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setMetricTimeRange } from "../../store/slices/dashboardSlice";

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const data = useDashboardData();
  const { kpis, movement, categories, products } = data;
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));

  const metricTimeRange = useSelector(
    (state: RootState) => state.dashboard
  ).metricTimeRange;
  // hardcode range
  const salesAndInventoryTrend = useMemo(() => {
    return generateSalesAndInventoryTrend(
      metricTimeRange.startDate,
      metricTimeRange.endDate
    );
  }, [metricTimeRange]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        p: matchMD ? 0 : 3,
        overflowX: "hidden",
        color: "black",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box"
      }}
    >
      <DashboardHeader onRangeChange={(r) => dispatch(setMetricTimeRange(r))} />
      {/* KPI Section */}
      <MetricLedger
        kpis={kpis}
        period={getMetricPeriodLabel(
          metricTimeRange.startDate,
          metricTimeRange.endDate
        )}
      />
      {/* Charts Section */}
      <Stack
        direction="column"
        flexWrap="wrap"
        spacing={3}
        sx={{ width: "100%", alignItems: "stretch" }}
      >
        {/* Full-width Bar Chart */}
        <Box sx={{ flex: "1 1 100%", minWidth: "100%" }}>
          <SalesVsInventoryChart
            metricData={salesAndInventoryTrend}
            metricRange={metricTimeRange}
          />
        </Box>

        {/* Half-width charts side by side */}
        <Box
          sx={{
            flex: 1
          }}
        >
          <InventoryMovementPie movement={movement} />
        </Box>

        <Box
          sx={{
            flex: 1
          }}
        >
          <TopMovingCategoryChart categoryData={categories} />
        </Box>

        {/* Full-width last chart */}
        <Box
          sx={{
            flex: 1
          }}
        >
          <MostSoldProductsChart productData={products} />
        </Box>
      </Stack>
    </Box>
  );
};

export default DashboardPage;
