import React, { FC } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PieChart } from "@mui/x-charts/PieChart";
import { CategoryData } from "../types/dashboardTypes";

interface TopMovingCategoryChartProps {
  categoryData: CategoryData[];
}

const TopMovingCategoryChart: FC<TopMovingCategoryChartProps> = ({
  categoryData
}) => {
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
        <Typography fontWeight={600}>Top Moving Category</Typography>
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
                data: categoryData.map((d, i) => ({
                  id: i,
                  value: d.value,
                  label: d.label
                })),
                innerRadius: 50, // adds donut look
                cornerRadius: 5,
                paddingAngle: 3,
                arcLabel: "value"
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

export default TopMovingCategoryChart;
