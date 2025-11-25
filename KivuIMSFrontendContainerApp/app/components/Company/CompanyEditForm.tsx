import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useUpdateCompany } from "../../hooks/api/useCompany";
import { CompanyInfo } from "../Registration/types/registrationTypes";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";

interface UpdateCompanyInfoProps {
  onClose: () => void;
}

const CompanyEditForm: React.FC<UpdateCompanyInfoProps> = ({ onClose }) => {
  const { t } = useKivunovaTranslation();
  const { companyData } = useSelector((state: RootState) => state.profile);
  const updateCompany = useUpdateCompany();

  // ✅ Validation schema
  const schema = Yup.object({
    name: Yup.string().required(
      t("company-name-required", "Company name is required")
    ),
    businessType: Yup.string().required(
      t("business-type-required", "Business type is required")
    ),
    currencyCode: Yup.string().required(
      t("currency-code-required", "Currency code is required")
    ),
    registrationNumber: Yup.string().required(
      t("registration-number-required", "Registration number is required")
    ),
    description: Yup.string().required(
      t("description-required", "Description is required")
    ),
    address: Yup.object({
      country: Yup.string().required(
        t("country-required", "Country is required")
      ),
      province: Yup.string().required(
        t("province-required", "Province is required")
      ),
      district: Yup.string().required(
        t("district-required", "District is required")
      ),
      sector: Yup.string().required(t("sector-required", "Sector is required")),
      cell: Yup.string().required(t("cell-required", "Cell is required")),
      village: Yup.string().required(
        t("village-required", "Village is required")
      ),
      streetAddress: Yup.string().required(
        t("street-required", "Street Address is required")
      )
    })
  }).required();

  // ✅ Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CompanyInfo>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: companyData
  });

  // ✅ Submit
  const onSubmit = async (data: CompanyInfo) => {
    try {
      await updateCompany.mutateAsync({ id: companyData?.id || "", ...data });
      reset(data);
      onClose();
    } catch (err) {
      console.error("Company update failed:", err);
    }
  };

  // ✅ Render helper
  const renderField = (name: string, label: string) => (
    <Controller
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={name as any}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          size="small"
          label={t(label, label.replace(/-/g, " "))}
          error={!!errors && !!errors[name]}
          helperText={errors[name]?.message}
        />
      )}
    />
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {t("edit-company-details", "Edit Company Details")}
      </Typography>

      {/* Company Basic Info */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr"
          },
          gap: 2
        }}
      >
        {renderField("name", "name")}
        {renderField("businessType", "business-type")}
        {renderField("currencyCode", "currency-code")}
        {renderField("registrationNumber", "registration-number")}
      </Box>

      {/* Address Section */}
      <Typography variant="subtitle1" fontWeight={600}>
        {t("company-address", "Company Address")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr"
          },
          gap: 2
        }}
      >
        {renderField("address.country", "country")}
        {renderField("address.province", "province")}
        {renderField("address.district", "district")}
        {renderField("address.sector", "sector")}
        {renderField("address.cell", "cell")}
        {renderField("address.village", "village")}
        <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
          {renderField("address.streetAddress", "street-address")}
        </Box>
      </Box>

      <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" }, mt: 3 }}>
        {renderField("description", "description")}
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 5 }}>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={updateCompany.isPending}
          sx={{
            flex: 1,
            mt: { xs: 2, sm: 0 },
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: BRAND_COLOR,
            "&:hover": { backgroundColor: BRAND_HOVER }
          }}
        >
          {t("save-changes", "Save Changes")}
        </LoadingButton>
        <Button
          type="button"
          variant="outlined"
          onClick={onClose}
          disabled={updateCompany.isPending}
          sx={{
            flex: 1,
            mt: { xs: 2, sm: 0 },
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: "white",
            color: BRAND_COLOR,
            border: `1px solid ${BRAND_COLOR}`,
            "&:hover": { backgroundColor: BRAND_HOVER, color: "white" }
          }}
        >
          {t("cancel", "Cancel")}
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyEditForm;
