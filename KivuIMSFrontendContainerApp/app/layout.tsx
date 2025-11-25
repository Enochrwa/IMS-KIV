import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Outlet } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { default as RouteGuard } from "~/components/common/RouteGuard";
import { StoreSelector } from "~/components/common/StoreSelector";
import logo from "~/assets/images/FullLogo_Transparent 2.svg";

const Layout = () => {
  const { logout, state } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <RouteGuard>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default"
        }}
      >
        {/* Header with Logout */}
        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="Kivu IMS Logo"
                style={{ height: "40px", width: "auto" }}
              />
            </Box>
            <StoreSelector />
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {state.user?.firstName} {state.user?.lastName}
            </Typography>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </RouteGuard>
  );
};

export default Layout;
