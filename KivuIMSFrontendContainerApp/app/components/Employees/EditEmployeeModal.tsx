import React from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  IconButton,
  Button,
  useTheme,
  MenuItem
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { useUpdateEmployee } from "../../hooks/api/useEmployee";
import { Employee, EmployeeFormData } from "./types/employees";
import { UserRole } from "../Profile/enums/profileEnums";

export interface UpdateEmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  role: UserRole;
}

const employeeSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  profileImage: Yup.string().optional(),
  role: Yup.mixed<UserRole>()
    .oneOf(Object.values(UserRole), "Invalid role")
    .required("Role is required")
}) as Yup.ObjectSchema<UpdateEmployeeFormData>;

interface UpdateEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
}

const UpdateEmployeeModal: React.FC<UpdateEmployeeModalProps> = ({
  open,
  onClose,
  employee
}) => {
  const updateEmployee = useUpdateEmployee();
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateEmployeeFormData>({
    resolver: yupResolver(employeeSchema),
    mode: "onChange",
    defaultValues: employee
  });

  const onSubmit: SubmitHandler<UpdateEmployeeFormData> = async (data) => {
    try {
      await updateEmployee.mutateAsync({
        userId: employee.id,
        updates: data as EmployeeFormData
      });
      onClose();
    } catch (err) {
      console.error("❌ Failed to update employee:", err);
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
    maxWidth: 900,
    p: 5,
    maxHeight: "90vh",
    overflowY: "auto"
  };

  const renderField = (
    name: keyof UpdateEmployeeFormData,
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
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Title */}
        <Box mb={3}>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            color="textPrimary"
          >
            Update Employee
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {renderField("firstName", "First Name")}
          {renderField("lastName", "Last Name")}
          {renderField("email", "Email", "example@kivunova.com", "email")}
          {renderField("phone", "Phone", "+2507...")}
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

          {renderField("profileImage", "Profile Image URL", "https://...")}

          {/* Footer Buttons */}
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
              loading={updateEmployee.isPending}
              sx={{
                flex: 1,
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: BRAND_COLOR,
                "&:hover": { backgroundColor: BRAND_HOVER }
              }}
            >
              Update Employee
            </LoadingButton>

            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              disabled={updateEmployee.isPending}
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

export default UpdateEmployeeModal;
