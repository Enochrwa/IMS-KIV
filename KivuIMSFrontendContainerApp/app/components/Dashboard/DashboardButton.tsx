import React from "react";
import { Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import {
  BRAND_COLOR,
  BRAND_DISABLED,
  BRAND_HOVER
} from "../common/constants/colors";

export const FilterButton = () => (
  <Button
    startIcon={<FilterListIcon />}
    variant="outlined"
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
    Filters
  </Button>
);

export const AddMetricButton = () => (
  <Button
    startIcon={<AddIcon />}
    variant="outlined"
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
    Add Metric
  </Button>
);
