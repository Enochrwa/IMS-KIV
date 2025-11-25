import { Box, Typography } from "@mui/material";
import { ImsLogo } from "../../../assets";
import React from "react";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";

const AuthSidePanel = () => {
  const { t } = useKivunovaTranslation();
  return (
    <Box
      sx={{
        width: "100%",
        // backgroundColor: "#C0A6FF",
        background: "linear-gradient(to bottom, #6f49c9, #f3f4f6)",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        p: 4,
        height: "100%",
        position: "relative",
        display: "flex"
      }}
      data-testid="auth-left-panel"
    >
      <Box
        textAlign="center"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Box width="100%" justifyContent="center" marginTop="-50px">
          <img
            src={ImsLogo}
            alt="Kivu IMS Logo"
            style={{ width: "400px", margin: "auto" }}
            data-testid="auth-logo"
          />
        </Box>
        <Box width="100%" justifyContent="100%">
          <Typography
            variant="h6"
            fontWeight="500"
            data-testid="auth-left-text"
            fontSize="16px"
            width="80%"
            textAlign="center"
            margin="auto"
          >
            {t(
              "auth-side-panel-intro-text",
              "Re-imagining inventory management experience with advance data analytics for optimum performance"
            )}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "16px",
          left: "0px",
          display: {
            sm: "none",
            xs: "none",
            md: "flex",
            lg: "flex",
            xl: "flex"
          },
          justifyContent: "center",
          width: "100%"
        }}
      >
        <Typography
          variant="caption"
          sx={{ width: "100%" }}
          data-testid="auth-left-footer"
          textAlign="center"
        >
          © kivunova 2025
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthSidePanel;
