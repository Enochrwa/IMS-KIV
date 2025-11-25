import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PieChart } from "@mui/x-charts/PieChart";
import { CategoryData } from "../types/dashboardTypes";
import { FC } from "react";

interface InventoryMovementPieProps {
  movement: CategoryData[];
}

const InventoryMovementPie: FC<InventoryMovementPieProps> = ({ movement }) => {
  return (
    <Accordion
      defaultExpanded
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: "background.paper"
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          px: 2
        }}
      >
        <Typography fontWeight={600}>Inventory Movement Landscape</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            p: 2
          }}
        >
          <PieChart
            height={300}
            series={[
              {
                innerRadius: 70,
                outerRadius: 120,
                paddingAngle: 3,
                cornerRadius: 5,
                arcLabel: "value",
                data: movement.map((d, i) => ({
                  id: i,
                  value: d.value,
                  label: d.label
                }))
              }
            ]}
            slotProps={{
              legend: {
                direction: "horizontal",
                position: { vertical: "bottom", horizontal: "center" }
              }
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default InventoryMovementPie;
