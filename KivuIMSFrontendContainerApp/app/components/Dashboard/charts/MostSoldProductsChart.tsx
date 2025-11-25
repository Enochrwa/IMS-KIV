import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BarChart } from "@mui/x-charts/BarChart";
import { ProductData } from "../types/dashboardTypes";
import { FC } from "react";

interface MostSoldProductsChartProps {
  productData: ProductData[];
}

const MostSoldProductsChart: FC<MostSoldProductsChartProps> = ({
  productData
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
        <Typography fontWeight={600}>Most Sold Products</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ width: "100%", overflowX: "auto", p: 1 }}>
          <BarChart
            height={300}
            layout="horizontal"
            yAxis={[
              {
                scaleType: "band",
                data: productData.map((d) => d.name)
              }
            ]}
            series={[
              {
                data: productData.map((d) => d.percent),
                color: "#1E88E5"
              }
            ]}
            margin={{ top: 20, right: 40, bottom: 40, left: 100 }}
            sx={{
              "& .MuiChartsLegend-root": {
                mt: 2
              }
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default MostSoldProductsChart;
