import React from "react";
import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import Topbar from "../../Navigation/Topbar";

interface AuthRightSidePanelProps {
  children: ReactNode;
}

const AuthRightSidePanel: FC<AuthRightSidePanelProps> = ({ children }) => {
  return (
    <Box
      flex={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}
    >
      <Topbar isAuthFlow />
      {children}
    </Box>
  );
};

export default AuthRightSidePanel;
