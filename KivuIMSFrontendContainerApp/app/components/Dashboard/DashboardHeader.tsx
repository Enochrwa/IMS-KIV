import React, { FC } from "react";
import { Box, Stack, useTheme } from "@mui/material";
import DateRangeSelector from "./DateRangeSelector";
import { AddMetricButton, FilterButton } from "./DashboardButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MetricTimeRange } from "./types/dashboardTypes";

interface DashboardHeaderProps {
  /** Fired when the date range changes */
  onRangeChange: (range: MetricTimeRange) => void;
  showRangeSelectorOnly?: boolean;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({
  onRangeChange,
  showRangeSelectorOnly
}) => {
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box display="flex" flexDirection="column" mb={2} width="100%">
      <Stack
        direction={matchMD ? "column" : "row"}
        spacing={2}
        width="100%"
        justifyContent="flex-end"
        alignItems={matchMD ? "stretch" : "center"}
      >
        {/* Date Range Picker */}
        <Box
          display="flex"
          justifyContent={matchMD ? "center" : "flex-start"}
          width={matchMD ? "100%" : "auto"}
        >
          <DateRangeSelector onChange={onRangeChange} />
        </Box>

        {/* Right-side action buttons */}
        {!showRangeSelectorOnly && (
          <Box
            width={matchMD ? "100%" : "auto"}
            justifyContent="center"
            flexDirection="row"
            display="flex"
            gap={2}
          >
            <AddMetricButton />
            <FilterButton />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default DashboardHeader;
