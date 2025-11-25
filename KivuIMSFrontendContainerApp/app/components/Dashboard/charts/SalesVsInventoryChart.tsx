import React, { FC, useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  differenceInMonths,
  differenceInYears,
  format,
  isWithinInterval
} from "date-fns";
import {
  MetricTimeRange,
  SalesAndInventoryTrend
} from "../types/dashboardTypes";

interface SalesVsInventoryTrendProps {
  metricData: SalesAndInventoryTrend[];
  metricRange: MetricTimeRange;
}

/**
 * Dynamic time-based chart visualizing Sales vs Inventory
 * for any MetricTimeRange (days, months, or years).
 */
const SalesVsInventoryTrend: FC<SalesVsInventoryTrendProps> = ({
  metricData,
  metricRange
}) => {
  const { startDate, endDate } = metricRange;

  // 🧮 Decide label granularity based on range
  const granularity = useMemo(() => {
    const totalMonths = differenceInMonths(endDate, startDate);
    const totalYears = differenceInYears(endDate, startDate);

    if (totalYears >= 2) return "year";
    if (totalMonths >= 2) return "month";
    return "day";
  }, [startDate, endDate]);

  // 🔍 Filter data within selected range and format labels
  const filteredData = useMemo(() => {
    const dataInRange = metricData.filter((d) =>
      isWithinInterval(d.date, { start: startDate, end: endDate })
    );

    return dataInRange.map((d) => {
      let label = "";
      switch (granularity) {
        case "year":
          label = format(d.date, "yyyy");
          break;
        case "month":
          label = format(d.date, "MMM");
          break;
        default:
          label = format(d.date, "MMM d");
      }
      return { ...d, label };
    });
  }, [metricData, startDate, endDate, granularity]);

  // 🏷️ Format readable date range for title
  const rangeLabel = useMemo(() => {
    const sameMonth =
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear();

    if (sameMonth) {
      return `${format(startDate, "MMM d")}–${format(endDate, "d, yyyy")}`;
    }
    return `${format(startDate, "MMM d, yyyy")} – ${format(endDate, "MMM d, yyyy")}`;
  }, [startDate, endDate]);

  return (
    <Accordion
      defaultExpanded
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: "background.paper"
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          px: 2
        }}
      >
        <Typography fontWeight={600}>
          Sales vs Inventory Trend ({rangeLabel})
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        {filteredData.length > 0 ? (
          <Box sx={{ width: "100%", overflowX: "auto", p: 1 }}>
            <BarChart
              height={300}
              xAxis={[
                {
                  data: filteredData.map((d) => d.label),
                  scaleType: "band"
                }
              ]}
              series={[
                {
                  data: filteredData.map((d) => d.sales),
                  label: "Sales",
                  color: "#42A5F5"
                },
                {
                  data: filteredData.map((d) => d.inventory),
                  label: "Inventory",
                  color: "#66BB6A"
                }
              ]}
              margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
              sx={{
                "& .MuiChartsLegend-root": { mt: 1 }
              }}
            />
          </Box>
        ) : (
          <Typography color="text.secondary" p={2}>
            No data available for the selected range.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default SalesVsInventoryTrend;
