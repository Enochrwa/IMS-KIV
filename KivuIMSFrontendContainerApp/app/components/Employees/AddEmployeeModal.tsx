import React from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  useTheme,
  MenuItem
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import useMediaQuery from "@mui/material/useMediaQuery";
import { EmployeeFormData } from "./types/employees";
import { UserRole } from "../Profile/enums/profileEnums";
import { useCreateEmployee } from "../../hooks/api/useEmployee";

const employeeSchema: Yup.ObjectSchema<EmployeeFormData> = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  profileImage: Yup.string().optional(),
  companyId: Yup.string().required("Company ID is required"),
  storeId: Yup.string().required("Store ID is required"),
  role: Yup.mixed<UserRole>()
    .oneOf(Object.values(UserRole), "Invalid role")
    .required("Role is required")
});

const DefaultEmployeeFormValues: EmployeeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  profileImage: "",
  companyId: "",
  storeId: "",
  role: UserRole.ANALYST
};

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  open,
  onClose
}) => {
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));
  const createEmployeeMutation = useCreateEmployee();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(employeeSchema),
    mode: "onChange",
    defaultValues: DefaultEmployeeFormValues
  });

  const onSubmit: SubmitHandler<EmployeeFormData> = async (data) => {
    try {
      await createEmployeeMutation.mutateAsync(data);
      reset(DefaultEmployeeFormValues);
      onClose();
    } catch (err) {
      console.error("❌ Failed to create employee:", err);
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
    width: matchMD ? "90%" : "60%",
    maxWidth: 700,
    p: 5,
    maxHeight: "90vh",
    overflowY: "auto"
  };

  const renderField = (
    name: keyof EmployeeFormData,
    label: string,
    placeholder?: string,
    type: "text" | "email" | "password" = "text"
  ) => (
    <Box sx={{ width: "80%", margin: "auto" }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            size="small"
            label={label}
            placeholder={placeholder}
            type={type}
            error={!!errors[name]}
            helperText={errors[name]?.message}
          />
        )}
      />
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          mb={3}
          color="textPrimary"
        >
          Add New Employee
        </Typography>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {renderField("firstName", "First Name", "Enter first name")}
          {renderField("lastName", "Last Name", "Enter last name")}
          {renderField("email", "Email", "Enter email", "email")}
          {renderField("phone", "Phone", "Enter phone")}
          {renderField("companyId", "Company ID", "COMP-001")}
          {renderField("storeId", "Store ID", "STORE-001")}

          {/* Role Dropdown */}
          <Box sx={{ width: "80%", margin: "auto" }}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  size="small"
                  label="Role"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                >
                  {Object.values(UserRole).map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          {/* Profile Image */}
          {renderField("profileImage", "Profile Image URL", "https://...")}

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mt: 6,
              width: "80%",
              margin: "auto"
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{
                flex: 1,
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: BRAND_COLOR,
                "&:hover": { backgroundColor: BRAND_HOVER }
              }}
            >
              Add Employee
            </LoadingButton>

            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              disabled={isSubmitting}
              sx={{
                flex: 1,
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "white",
                color: BRAND_COLOR,
                border: `1px solid ${BRAND_COLOR}`,
                "&:hover": { backgroundColor: BRAND_HOVER, color: "white" }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEmployeeModal;
