import React, { ReactNode, useCallback } from "react";
import { Box, Container } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./styles/flyOver.css";

interface FlyoverProps {
  isOpen: boolean;
  closeMenu: () => void;
  children: ReactNode;
}

const Flyover: React.FC<FlyoverProps> = ({ isOpen, closeMenu, children }) => {
  const handleRootClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;

      // If the click happened inside the left panel, ignore it
      if (target.closest(".flyover-left")) return;

      // Otherwise, close
      closeMenu();
    },
    [closeMenu]
  );

  return (
    <div
      className={`flyover ${isOpen ? "open" : ""}`}
      onClick={handleRootClick}
    >
      <Box className="overlay-content">
        {/* Left Side (your sidebar content) */}
        <Container className="flyover-left">{children}</Container>

        {/* Right Side Overlay (click to close) */}
        <Container className="flyover-right-side" onClick={closeMenu}>
          <CloseIcon fontSize="medium" />
        </Container>
      </Box>
    </div>
  );
};

export default Flyover;
