import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";

interface NoCategoryFoundProps {
  onAddClick?: () => void;
}

const NoCategoryFound: React.FC<NoCategoryFoundProps> = ({ onAddClick }) => {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "text.secondary",
        p: 4
      }}
    >
      <CategoryOutlinedIcon
        sx={{ fontSize: 70, color: "text.disabled", mb: 2 }}
      />

      <Typography variant="h6" fontWeight={600} mb={1} color="text.primary">
        No Categories Found
      </Typography>

      <Typography variant="body2" mb={3} color="text.secondary">
        You haven’t added any categories yet. Create your first one to start
        organizing products into logical groups.
      </Typography>

      {onAddClick && (
        <Button
          variant="contained"
          onClick={onAddClick}
          sx={{
            backgroundColor: BRAND_COLOR,
            "&:hover": { backgroundColor: BRAND_HOVER },
            textTransform: "none"
          }}
        >
          Add New Category
        </Button>
      )}
    </Box>
  );
};

export default NoCategoryFound;
