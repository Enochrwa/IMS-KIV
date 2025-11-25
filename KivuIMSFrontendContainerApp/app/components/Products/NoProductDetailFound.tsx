import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";

const NoProductDetailFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "70vh",
        color: "black"
      }}
    >
      <Typography color="textPrimary" variant="h5" fontWeight="bold" mb={2}>
        Product Not Found
      </Typography>
      <Typography color="text.secondary" mb={3}>
        The product you’re looking for doesn’t exist or has been removed.
      </Typography>
      <Button
        variant="contained"
        startIcon={<ArrowBackOutlinedIcon />}
        onClick={() => navigate("/products")}
      >
        Back to Product List
      </Button>
    </Box>
  );
};

export default NoProductDetailFound;
