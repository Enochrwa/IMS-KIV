import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Modal,
  Typography,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";
import CompanyEditForm from "./CompanyEditForm";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { EditOutlined } from "@mui/icons-material";

const CompanyView: React.FC = () => {
  const { t } = useKivunovaTranslation();
  const { companyData } = useSelector((state: RootState) => state.profile);
  const [openEditModal, setOpenEditModal] = useState(false);

  if (!companyData) return null;

  const renderField = (label: string, value?: string) => (
    <Box sx={{ flex: "1 1 45%", mb: 2 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {t(label, label.replace(/-/g, " "))}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: value ? "text.primary" : "text.disabled",
          fontWeight: 500
        }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              mb: 3
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {t("company-information", "Company Information")}
            </Typography>

            <Button
              variant="contained"
              onClick={() => setOpenEditModal(true)}
              startIcon={<EditOutlined />}
              sx={{
                mt: { xs: 2, sm: 0 },
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: BRAND_COLOR,
                "&:hover": { backgroundColor: BRAND_HOVER }
              }}
            >
              {t("edit-company", "Edit Company")}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Info Section */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mb: 2 }}
            color="text.primary"
          >
            {t("company-details", "Company Details")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3
            }}
          >
            {renderField("name", companyData.name)}
            {renderField("business-type", companyData.businessType)}
            {renderField("currency-code", companyData.currencyCode)}
            {renderField("registration-number", companyData.registrationNumber)}
          </Box>

          {/* Address Section */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mt: 3, mb: 2 }}
            color="text.primary"
          >
            {t("company-address", "Company Address")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3
            }}
          >
            {renderField("country", companyData.address.country)}
            {renderField("province", companyData.address.province)}
            {renderField("district", companyData.address.district)}
            {renderField("sector", companyData.address.sector)}
            {renderField("cell", companyData.address.cell)}
            {renderField("village", companyData.address.village)}
            {renderField("street-address", companyData.address.streetAddress)}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {renderField("description", companyData.description)}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-company-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            width: { xs: "90%", sm: 600 },
            p: 3,
            outline: "none"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}
          >
            <Typography
              id="edit-company-modal-title"
              variant="h6"
              fontWeight={600}
            >
              {t("edit-company-info", "Edit Company Information")}
            </Typography>
            <IconButton
              onClick={() => setOpenEditModal(false)}
              size="small"
              aria-label={t("close-modal", "Close")}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <CompanyEditForm onClose={() => setOpenEditModal(false)} />
        </Box>
      </Modal>
    </>
  );
};

export default CompanyView;
