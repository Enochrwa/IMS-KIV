import React from "react";
import { Box, Typography, Modal, Button } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { Employee } from "./types/employees";
import { useDeleteEmployee } from "../../hooks/api/useEmployee";

interface DeleteEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
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
  minWidth: 250,
  boxShadow: 24,
  textAlign: "center"
};

const DeleteEmployeeModal: React.FC<DeleteEmployeeModalProps> = ({
  open,
  onClose,
  employee
}) => {
  const deleteEmployee = useDeleteEmployee();

  const handleDelete = async () => {
    try {
      await deleteEmployee.mutateAsync(employee.id);
      onClose();
    } catch (err) {
      console.error("❌ Failed to delete employee:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} color="black">
        <WarningAmberRoundedIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />

        <Typography variant="h6" mb={1} fontSize={18} fontWeight={600}>
          Delete Employee
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Are you sure you want to delete{" "}
          <strong>
            {employee?.firstName} {employee?.lastName}
          </strong>
          ? This action cannot be undone.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              backgroundColor: "white",
              color: BRAND_COLOR,
              border: `1px solid ${BRAND_COLOR}`,
              "&:hover": {
                backgroundColor: BRAND_HOVER,
                color: "white"
              },
              textTransform: "none",
              borderRadius: 2
            }}
          >
            No
          </Button>

          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { opacity: 0.9 }
            }}
            disabled={deleteEmployee.isPending}
          >
            {deleteEmployee.isPending ? "Deleting..." : "Yes, Delete"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteEmployeeModal;
