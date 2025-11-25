import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  KivuI18nContext,
  localizedPath,
  useKivunovaTranslation
} from "@kivunova/kivufrontendcommon";
import { PAGE_ROUTE_LOGIN } from "../PageRoutes";
import { ImsLogo } from "../assets";
import { BRAND_COLOR, BRAND_HOVER } from "./common/constants/colors";

const Welcome = () => {
  const navigate = useNavigate();
  const { language, defaultLang } = useContext(KivuI18nContext);
  const { t } = useKivunovaTranslation();

  const handleGetStarted = () => {
    navigate(localizedPath(PAGE_ROUTE_LOGIN, language, defaultLang));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "linear-gradient(to bottom, #6f49c9, #f3f4f6)",
        px: { xs: 1, sm: 2 }
      }}
    >
      <Box
        component="img"
        src={ImsLogo}
        alt="Kivu IMS Logo"
        sx={{ width: { xs: 300, sm: 350, md: 400 }, height: "auto", mb: 4 }}
      />
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t("welcome-to-ims-heading-text", "Welcome to Kivunova IMS")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 6 }}>
        {t(
          "welcome-to-ims-intro-text",
          "A simplified inventory management to drive business growth and strategically scale operations"
        )}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: BRAND_COLOR,
          color: "#fff",
          "&:hover": { backgroundColor: BRAND_HOVER },
          borderRadius: 4,
          px: 4,
          py: 1.5
        }}
        size="large"
        onClick={handleGetStarted}
        endIcon={<ArrowForwardIcon />}
      >
        {t("get-started-button", "Get Started")}
      </Button>
    </Box>
  );
};

export default Welcome;
