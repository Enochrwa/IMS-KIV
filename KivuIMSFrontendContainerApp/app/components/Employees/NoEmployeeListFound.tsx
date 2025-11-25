import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddEmployeeModal from "./AddEmployeeModal";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";

const NoEmployeeListFound: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <Box
      sx={{
        p: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "70vh"
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        No Employee Found
      </Typography>
      <Typography color="text.secondary" mb={3}>
        It looks like there are no employees in your inventory yet.
        <br />
        Click below to add your first employee.
      </Typography>

      <Box>
        <Button
          variant="contained"
          onClick={() => setOpenAddModal(true)}
          sx={{
            backgroundColor: BRAND_COLOR,
            flex: 1,
            "&:hover": {
              backgroundColor: BRAND_HOVER,
              opacity: 0.8
            },
            textDecoration: "none"
          }}
        >
          Add New Product
        </Button>
      </Box>

      {/* Modal directly inside component */}
      <AddEmployeeModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
    </Box>
  );
};

export default NoEmployeeListFound;
