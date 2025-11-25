import React, { FC } from "react";
import { Box } from "@mui/material";
import { KPI } from "../../Dashboard/types/dashboardTypes";
import MetricCard from "./MetricCard";

interface MetricLedgerProps {
  /** Array of KPI metrics to render */
  kpis: KPI[];
  period: string;
  /** Optional: number of columns for various breakpoints */
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  /** Optional: gap between grid items (default = 2) */
  gap?: number;
}

/**
 * Reusable responsive KPI Grid.
 * Automatically adjusts layout based on screen size
 * and renders MetricCard for each KPI item.
 */
const MetricLedger: FC<MetricLedgerProps> = ({
  kpis,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 2,
  period
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(${columns.xs}, 1fr)`,
          sm: `repeat(${columns.sm}, 1fr)`,
          md: `repeat(${columns.md}, 1fr)`,
          lg: `repeat(${columns.lg}, 1fr)`
        },
        gap,
        width: "100%"
      }}
    >
      {kpis.map((kpi) => (
        <MetricCard key={kpi.id} kpiMetric={kpi} period={period} />
      ))}
    </Box>
  );
};

export default MetricLedger;
