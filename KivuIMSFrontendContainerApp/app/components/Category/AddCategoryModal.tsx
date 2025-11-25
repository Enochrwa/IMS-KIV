import React from "react";
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useCreateCategory } from "../../hooks/api/useCategory";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { DefaultCategoryFormValues } from "./constants/categoryConstants";
import { CategoryFormData } from "./types/categoryTypes";

const schema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string().optional(),
  parentId: Yup.string().optional(),
  companyId: Yup.string().required("Company ID is required"),
  createdBy: Yup.string().required("Created By is required")
}) as Yup.ObjectSchema<CategoryFormData>;

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onClose
}) => {
  const createCategory = useCreateCategory();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: DefaultCategoryFormValues
  });

  const onSubmit = async (data: CategoryFormData) => {
    await createCategory.mutateAsync(data);
    reset(DefaultCategoryFormValues);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          width: "90%",
          maxWidth: 500,
          p: 4
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" textAlign="center" mb={2}>
          Add New Category
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
                multiline
                rows={3}
                fullWidth
              />
            )}
          />
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Parent Category ID" fullWidth />
            )}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={createCategory.isPending}
            sx={{
              backgroundColor: BRAND_COLOR,
              "&:hover": { backgroundColor: BRAND_HOVER },
              textTransform: "none"
            }}
          >
            Add Category
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCategoryModal;
