import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { PAGE_PORTAL_DASHBOARD } from "../../PageRoutes";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import CustomProgressBar from "../common/CustomProgressBar/CustomProgressBar";
import AlertBannerText from "../common/AlertBanner/AlertBanner";

interface TopbarProps {
  isAuthFlow?: boolean;
  openFlyOver?: () => void;
  showMenuIcon?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({
  isAuthFlow,
  openFlyOver,
  showMenuIcon
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle =
    location.pathname.split("/").filter(Boolean).pop() || "Home";

  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        borderBottom: "1px solid #e0e0e0"
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: isAuthFlow ? "end" : "space-between"
        }}
      >
        {!isAuthFlow && (
          <>
            {!showMenuIcon ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => navigate(-1)} size="small">
                  <ArrowBackIcon />
                </IconButton>
                <Typography style={{ fontSize: "12px" }}>
                  {pageTitle === PAGE_PORTAL_DASHBOARD ? "Home" : pageTitle}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={() => openFlyOver?.()}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </>
        )}
        <LanguageSelector />
      </Toolbar>
      <CustomProgressBar />
      <Box>
        <AlertBannerText />
      </Box>
    </AppBar>
  );
};

export default Topbar;
