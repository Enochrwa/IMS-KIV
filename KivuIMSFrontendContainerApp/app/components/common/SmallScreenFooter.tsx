import React from "react";
import { Box, Typography } from "@mui/material";
import { footerBoxSx } from "./buttonStyles";

const SmallScreenFooter: React.FC = () => (
  <Box sx={footerBoxSx}>
    <Typography
      variant="caption"
      sx={{ textAlign: "center", width: "100%" }}
      data-testid="forgot-password-footer"
    >
      © kivunova 2025
    </Typography>
  </Box>
);

export default SmallScreenFooter;
