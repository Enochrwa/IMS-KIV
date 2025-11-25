import React from "react";
import { Box, Typography, Modal, Button } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { useDeleteCategory } from "../../hooks/api/useCategory";
import { Category } from "./types/categoryTypes";

interface DeleteCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: Category;
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
  minWidth: 300,
  boxShadow: 24,
  textAlign: "center",
  color: "black"
};

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  open,
  onClose,
  category
}) => {
  const deleteCategory = useDeleteCategory();

  const handleDelete = async () => {
    try {
      await deleteCategory.mutateAsync({ id: category.id });
      onClose();
    } catch (err) {
      console.error("❌ Failed to delete category:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <WarningAmberRoundedIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" mb={1} fontSize={18}>
          Do you really want to delete this category?
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

export default DeleteCategoryModal;
