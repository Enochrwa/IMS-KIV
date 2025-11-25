import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { KPI } from "../../Dashboard/types/dashboardTypes";
import { FC } from "react";

interface MetricCardProps {
  kpiMetric: KPI;
  period: string;
}

const MetricCard: FC<MetricCardProps> = ({ kpiMetric, period }) => {
  const { title, value, trend, spark, positive } = kpiMetric;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%", // ensures even card height
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 4
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1
        }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>

        <IconButton size="small" sx={{ color: "text.secondary" }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Value + Sparkline */}
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
        spacing={1}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {value}
          </Typography>
          <Typography
            variant="body2"
            color={positive ? "success.main" : "error.main"}
            sx={{ mt: 0.5 }}
          >
            {positive ? "↑" : "↓"} {trend}% vs {period}
          </Typography>
        </Box>

        {spark && (
          <Box sx={{ width: 70, height: 45 }}>
            <SparkLineChart
              data={spark}
              color={positive ? "#2E7D32" : "#C62828"}
              area
              curve="catmullRom"
              showTooltip
              opacity={0.2}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default MetricCard;
