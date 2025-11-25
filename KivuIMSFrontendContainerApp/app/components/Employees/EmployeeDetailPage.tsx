import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import { useParams } from "react-router-dom";
import { useGetEmployeeDetail } from "../../hooks/api/useEmployee";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import UpdateEmployeeModal from "./EditEmployeeModal";
import NoEmployeeDetailFound from "./NoEmployeeDetailFound";

const EmployeeDetailPage: React.FC = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { employeeId } = useParams<{ employeeId: string }>();
  const employee = useSelector(
    (state: RootState) => state.employees.employeeDetail
  );

  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));
  const getEmployeeDetailMutation = useGetEmployeeDetail();

  useEffect(() => {
    (async () => {
      try {
        if (employeeId) {
          await getEmployeeDetailMutation.mutateAsync({ employeeId });
        }
      } catch {
        console.error("Failed to fetch employee details");
      }
    })();
  }, [employeeId]);

  if (!employee) {
    return <NoEmployeeDetailFound />;
  }

  const fields: [string, string | undefined | number][] = [
    ["First Name", employee.firstName],
    ["Last Name", employee.lastName],
    ["Email", employee.email],
    ["Phone", employee.phone],
    ["Role", employee.role],
    ["Company ID", employee.id],
    ["Store ID", employee.id],
    ["Account Status", employee.accountStatus],
    ["Profile Image", employee.profileImage ? "Available" : "Not Uploaded"]
  ];

  return (
    <Box sx={{ color: "black" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={matchMD ? "column" : "row"}
        alignItems="center"
        mb={3}
        flexWrap="wrap"
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign={matchMD ? "center" : "left"}
        >
          {employee.firstName} {employee.lastName}
        </Typography>

        <Box
          display="flex"
          justifyContent={matchMD ? "center" : "flex-end"}
          alignItems="center"
          width={matchMD ? "100%" : "auto"}
          gap={2}
          mt={{ xs: 2, md: 0 }}
        >
          <Button
            variant="text"
            startIcon={<EditOutlinedIcon />}
            onClick={() => setOpenEdit(true)}
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
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={() => setOpenDelete(true)}
            sx={{
              textTransform: "none"
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Detail Card */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 2,
          overflow: "hidden"
        }}
      >
        <Grid container>
          {fields.map(([label, value], index) => (
            <React.Fragment key={label}>
              <Grid
                sx={{
                  width: "100%",
                  padding: "0 10px",
                  display: "flex",
                  borderBottom:
                    index === fields.length - 1 ? "none" : "1px solid #e0e0e0"
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    borderRight: "0.5px solid #e0e0e0",
                    p: 1.5,
                    bgcolor: "white"
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    {label}:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 2,
                    p: 1.5,
                    bgcolor: "white"
                  }}
                >
                  <Typography variant="body2">{value ?? "-"}</Typography>
                </Box>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>

      {/* Modals */}
      <UpdateEmployeeModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        employee={employee}
      />
      <DeleteEmployeeModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        employee={employee}
      />
    </Box>
  );
};

export default EmployeeDetailPage;
