import React, { FC } from "react";
import { BRAND_COLOR } from "../common/constants/colors";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import StoreIcon from "@mui/icons-material/Store";
import PreviewIcon from "@mui/icons-material/Preview";

interface RenderRegistrationIconProps {
  index: number;
  activeStep: number;
}

const RenderRegistrationIcon: FC<RenderRegistrationIconProps> = ({
  index,
  activeStep
}) => {
  const color = index <= activeStep ? BRAND_COLOR : "#ccc";

  if (index === 1) {
    return <BusinessIcon sx={{ color }} />;
  }

  if (index === 2) {
    return <StoreIcon sx={{ color }} />;
  }

  if (index === 3) {
    return <PreviewIcon sx={{ color }} />;
  }

  return <PersonIcon sx={{ color }} />;
};

export default RenderRegistrationIcon;
