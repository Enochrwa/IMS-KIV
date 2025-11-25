import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";
import {
  AdminInfo,
  CompanyInfo,
  StoreInfo,
  RegistrationData
} from "./types/registrationTypes";
import { BRAND_COLOR } from "../common/constants/colors";

interface ReviewSubmitProps {
  allData: Partial<RegistrationData>;
}

const ReviewAndSubmit: React.FC<ReviewSubmitProps> = ({ allData }) => {
  const { t } = useKivunovaTranslation();

  const formatAddress = (address?: {
    province?: string;
    district?: string;
    sector?: string;
    cell?: string;
    village?: string;
    streetAddress?: string;
    country?: string;
  }): string => {
    if (!address) return "N/A";

    const parts = [
      address.streetAddress,
      address.village,
      address.cell,
      address.sector,
      address.district,
      address.province,
      address.country
    ]
      .filter(Boolean)
      .join(", ");

    return parts || "N/A";
  };

  const renderSection = (
    data: AdminInfo | StoreInfo | CompanyInfo | undefined,
    chipLabel: string,
    defaultExpanded?: boolean
  ) => {
    if (!data) return null;

    const entries = Object.entries(data);

    return (
      <Accordion
        defaultExpanded={defaultExpanded}
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          mb: 2,
          "&:before": { display: "none" }
        }}
      >
        {/* Accordion Header */}
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: BRAND_COLOR }} />}
          sx={{
            backgroundColor: "#fafafa",
            borderBottom: "1px solid rgba(0,0,0,0.05)"
          }}
        >
          <Typography variant="body2" fontWeight={550}>
            {chipLabel}
          </Typography>
        </AccordionSummary>

        {/* Accordion Content */}
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              overflow: "hidden",
              border: "none",
              padding: "4px"
            }}
          >
            <Table
              size="small"
              sx={{
                "& td": {
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  py: 1.2,
                  px: { xs: 1, sm: 2 }
                },
                "& tr:last-child td": {
                  borderBottom: "none"
                }
              }}
            >
              <TableBody>
                {entries.map(([key, value]) => {
                  const label = t(
                    `registration-${key}`,
                    key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())
                  );

                  let displayValue: string | React.ReactNode = "N/A";

                  if (key === "password") {
                    displayValue = "********";
                  } else if (key === "address" && typeof value === "object") {
                    displayValue = formatAddress(value);
                  } else if (
                    typeof value === "string" ||
                    typeof value === "number"
                  ) {
                    displayValue = String(value);
                  }

                  return (
                    <TableRow key={key}>
                      <TableCell
                        sx={{
                          width: "40%",
                          fontWeight: 500,
                          color: "text.secondary",
                          borderRight: "1px solid rgba(0,0,0,0.05)"
                        }}
                      >
                        {label}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          wordBreak: "break-word",
                          color: "text.primary",
                          fontWeight: 500
                        }}
                      >
                        {displayValue}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 3 },
        maxWidth: 800,
        mx: "auto",
        width: "100%"
      }}
    >
      {renderSection(
        allData.admin,
        t("personal-information-chip-label", "Personal Info"),
        true
      )}
      {renderSection(
        allData.company,
        t("company-information-chip-label", "Company Info")
      )}
      {renderSection(
        allData.store,
        t("store-information-chip-label", "Store Info")
      )}
    </Box>
  );
};

export default ReviewAndSubmit;
