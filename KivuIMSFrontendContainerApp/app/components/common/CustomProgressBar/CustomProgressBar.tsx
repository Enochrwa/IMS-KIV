import React, { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { BRAND_COLOR, BRAND_HOVER } from "../constants/colors";

const CustomProgressBar: React.FC = () => {
  const isFetching = useIsFetching({
    predicate: (query) => !query.meta?.skipLoader
  });

  const isMutating = useIsMutating({
    predicate: (mutation) => !mutation.options.meta?.skipLoader
  });

  const isLoading = isFetching > 0 || isMutating > 0;

  // 🌀 Fade & smooth exit effect
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <Box
      sx={{
        width: "60%",
        height: 3,
        zIndex: 12000,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
        backgroundColor: "transparent",
        margin: "auto"
      }}
    >
      {visible && (
        <LinearProgress
          sx={{
            height: "100%",
            width: "100%",
            backgroundColor: "transparent",
            "& .MuiLinearProgress-bar": {
              width: "50%",
              background: `linear-gradient(90deg, ${BRAND_COLOR}, ${BRAND_HOVER}, ${BRAND_COLOR})`,
              animation: "sweep 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite"
            },
            "@keyframes sweep": {
              "0%": {
                transform: "translateX(-100%) scaleX(0.5)",
                opacity: 0.3
              },
              "25%": { opacity: 0.6 },
              "50%": { transform: "translateX(50%) scaleX(1)", opacity: 1 },
              "75%": { opacity: 0.7 },
              "100%": {
                transform: "translateX(120%) scaleX(0.8)",
                opacity: 0.3
              }
            }
          }}
        />
      )}
    </Box>
  );
};

export default CustomProgressBar;
