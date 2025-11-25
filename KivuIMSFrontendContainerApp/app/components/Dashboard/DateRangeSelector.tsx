import React, { FC, useState } from "react";
import {
  Box,
  Button,
  Popover,
  Stack,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import {
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  isSameDay,
  startOfYear,
  subYears,
  endOfDay
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  BRAND_COLOR,
  BRAND_DISABLED,
  BRAND_HOVER
} from "../common/constants/colors";

interface DateRangeSelectorProps {
  onChange: (range: { startDate: Date; endDate: Date }) => void;
}

const DateRangeSelector: FC<DateRangeSelectorProps> = ({ onChange }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [range, setRange] = useState<Range>({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    key: "selection"
  });
  const [tempRange, setTempRange] = useState<Range>(range);

  // === Sidebar preset definitions ===
  const presets = [
    {
      label: "Today",
      range: () => ({ startDate: new Date(), endDate: new Date() })
    },
    {
      label: "This Month",
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date())
      })
    },
    {
      label: "YTD",
      range: () => ({
        startDate: startOfYear(new Date()),
        endDate: new Date()
      })
    },
    {
      label: "Yesterday",
      range: () => ({
        startDate: subDays(new Date(), 1),
        endDate: subDays(new Date(), 1)
      })
    },
    {
      label: "Last 7 Days",
      range: () => ({ startDate: subDays(new Date(), 6), endDate: new Date() })
    },
    {
      label: "Last Month",
      range: () => {
        const start = startOfMonth(subMonths(new Date(), 1));
        const end = endOfMonth(subMonths(new Date(), 1));
        return { startDate: start, endDate: end };
      }
    },
    {
      label: "1 Year",
      range: () => ({
        startDate: subYears(new Date(), 1),
        endDate: new Date()
      })
    },
    {
      label: "5 Years",
      range: () => ({
        startDate: subYears(new Date(), 5),
        endDate: new Date()
      })
    }
  ];

  // === Helper to check if current range matches preset ===
  const isPresetActive = (preset: (typeof presets)[number]) => {
    const presetRange = preset.range();
    return (
      isSameDay(tempRange.startDate!, presetRange.startDate!) &&
      isSameDay(tempRange.endDate!, presetRange.endDate!)
    );
  };

  // === Handlers ===
  const handleSelect = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    if (selection.startDate && selection.endDate) {
      setTempRange(selection);
    }
  };

  const handlePresetClick = (preset: (typeof presets)[number]) => {
    const newRange = preset.range();
    setTempRange({ ...newRange, key: "selection" });
  };

  const handleApply = () => {
    setRange(tempRange);
    onChange({ startDate: tempRange.startDate!, endDate: tempRange.endDate! });
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setTempRange(range); // revert
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const formatted =
    range.startDate && range.endDate
      ? `${format(range.startDate, "MMM d, yyyy")} – ${format(
          range.endDate,
          "MMM d, yyyy"
        )}`
      : "Select Date Range";

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="outlined"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          textTransform: "none",
          minWidth: 250,
          justifyContent: "space-between",
          color: "text.primary",
          borderColor: "#d2c8f7",
          "&:hover": { borderColor: "#5b36b0" }
        }}
      >
        {formatted}
      </Button>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2,
            width: isSmall ? "95vw" : "auto",
            maxWidth: "90vw",
            overflowX: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }
        }}
      >
        <Stack
          direction={isSmall ? "column" : "row"}
          spacing={isSmall ? 2 : 0}
          alignItems="stretch"
        >
          {/* Shortcuts */}
          {isSmall ? (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 1,
                pb: 1,
                "&::-webkit-scrollbar": { display: "none" }
              }}
            >
              {presets.map((preset) => {
                const active = isPresetActive(preset);
                return (
                  <Button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    variant={active ? "contained" : "outlined"}
                    size="small"
                    sx={{
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      borderColor: BRAND_COLOR,
                      color: active ? "white" : BRAND_COLOR,
                      backgroundColor: active ? BRAND_COLOR : "transparent",
                      "&:hover": {
                        backgroundColor: BRAND_HOVER,
                        color: "white"
                      },
                      textTransform: "none"
                    }}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ pr: 2, borderRight: "1px solid #eee", minWidth: 160 }}>
              {presets.map((preset) => {
                const active = isPresetActive(preset);
                return (
                  <Button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    sx={{
                      display: "block",
                      textTransform: "none",
                      justifyContent: "flex-start",
                      width: "100%",
                      mb: 0.6,
                      border: `1px solid ${BRAND_COLOR}`,
                      color: active ? "white" : BRAND_COLOR,
                      backgroundColor: active ? BRAND_COLOR : "white",
                      "&:hover": {
                        backgroundColor: BRAND_HOVER,
                        color: "white"
                      }
                    }}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Calendar */}
          <Box>
            <DateRange
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              ranges={[tempRange]}
              maxDate={endOfDay(new Date())}
              direction={isSmall ? "vertical" : "horizontal"}
              showMonthAndYearPickers
              rangeColors={["#b291f8"]} // primary range highlight
            />

            <Divider sx={{ mt: 2, mb: 1 }} />

            {/* Footer buttons */}
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button
                onClick={handleCancel}
                size="small"
                sx={{
                  backgroundColor: "white",
                  color: BRAND_COLOR,
                  border: `1px solid ${BRAND_COLOR}`,
                  "&:hover": { backgroundColor: BRAND_HOVER, color: "white" },
                  "&:disabled": { backgroundColor: BRAND_DISABLED },
                  textTransform: "none",
                  fontSize: "1rem"
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: BRAND_COLOR,
                  "&:hover": { backgroundColor: BRAND_HOVER },
                  textTransform: "none"
                }}
                disabled={!tempRange.startDate || !tempRange.endDate}
              >
                Apply
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Popover>
    </>
  );
};

export default DateRangeSelector;
