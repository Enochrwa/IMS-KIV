import React from "react";
import { Box, Typography, Modal, Button } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Product } from "./types/products";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";

interface DeleteProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  p: 4,
  maxWidth: 400,
  minWidth: 200,
  boxShadow: 24,
  textAlign: "center"
};

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  open,
  onClose,
  product
}) => {
  const handleDelete = () => {
    console.log(`Deleting product: ${product.id}`);
    // TODO: implement API call
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} color="black">
        <WarningAmberRoundedIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" mb={1} fontSize={18}>
          Do you really want to delete this product?
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          This action cannot be undone.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              backgroundColor: "white",
              color: BRAND_COLOR,
              "&:hover": {
                backgroundColor: BRAND_HOVER,
                opacity: 0.8,
                color: "white"
              },
              textTransform: "none"
            }}
          >
            No
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteProductModal;
