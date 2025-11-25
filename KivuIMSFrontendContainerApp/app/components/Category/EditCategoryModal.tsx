import React from "react";
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useUpdateCategory } from "../../hooks/api/useCategory";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { Category, CategoryFormData } from "./types/categoryTypes";

const schema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string().optional(),
  parentId: Yup.string().optional()
}) as Yup.ObjectSchema<CategoryFormData>;

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: Category;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  open,
  onClose,
  category
}) => {
  const updateCategory = useUpdateCategory();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: category.name,
      description: category.description,
      parentId: category.parentId ?? null,
      companyId: category.companyId,
      createdBy: category.createdBy
    }
  });

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        ...data,
        input: {}
      });
      onClose();
    } catch (error) {
      console.error("❌ Failed to update category:", error);
    }
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    width: "90%",
    maxWidth: 500,
    p: 4
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={3}>
          Edit Category
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Parent Category ID"
                fullWidth
                error={!!errors.parentId}
                helperText={errors.parentId?.message}
              />
            )}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={updateCategory.isPending}
            sx={{
              backgroundColor: BRAND_COLOR,
              "&:hover": { backgroundColor: BRAND_HOVER },
              textTransform: "none"
            }}
          >
            Save Changes
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditCategoryModal;
