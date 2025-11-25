import React, { useEffect, useState } from "react";
import { Box, Container, useTheme } from "@mui/material";
import Sidebar from "../Navigation/Sidebar";
import Topbar from "../Navigation/Topbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Flyover from "../common/Flyover/Flyover";
import { Outlet } from "react-router";

const AppShell: React.FC = () => {
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));
  const [showFlyOver, setShowFlyOver] = useState<boolean>(false);

  useEffect(() => {
    if (!matchMD) {
      setShowFlyOver(false);
    }
  }, [matchMD]);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "inherit" }}>
      {/* Persistent Sidebar */}
      {!matchMD && <Sidebar />}

      {/* Main layout area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <Topbar
          openFlyOver={matchMD ? () => setShowFlyOver(true) : undefined}
          showMenuIcon={matchMD}
        />

        {/* Dynamic content (your MFE routes / children) */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 3,
            boxSizing: "border-box",
            bgcolor: "#fafafa"
          }}
        >
          <Outlet />
        </Box>
        <Flyover
          isOpen={showFlyOver}
          closeMenu={() => {
            setShowFlyOver(!showFlyOver);
          }}
        >
          <Container>
            <Sidebar setFlyOver={setShowFlyOver} />
          </Container>
        </Flyover>
      </Box>
    </Box>
  );
};

export default AppShell;
