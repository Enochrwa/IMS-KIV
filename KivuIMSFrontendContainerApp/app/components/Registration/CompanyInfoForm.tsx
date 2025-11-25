import React from "react";
import {
  CountryFullName,
  SupportedCurrencyCountryMap,
  useKivunovaTranslation,
  useRwandaLocation
} from "@kivunova/kivufrontendcommon";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import { RegistrationData } from "./types/registrationTypes";

interface CompanyInfoFormProps {
  control: Control<RegistrationData>;
  errors: FieldErrors<RegistrationData>;
  watch: UseFormWatch<RegistrationData>;
  setValue: UseFormSetValue<RegistrationData>;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({
  control,
  errors,
  watch,
  setValue
}) => {
  const { t } = useKivunovaTranslation();
  // Note: locationKey used for translation keys for places
  const locationKey = (type: string, name: string) =>
    `location-${type}-${name}`;
  const {
    getProvinces,
    getDistrictByProvince,
    getSectors,
    getCells,
    getVillages,
    loading
  } = useRwandaLocation();

  const provinces = getProvinces();
  const selectedProvince = watch("company.address.province");
  const selectedDistrict = watch("company.address.district");
  const selectedSector = watch("company.address.sector");
  const selectedCell = watch("company.address.cell");
  const selectedVillage = watch("company.address.village");

  const districts = selectedProvince
    ? getDistrictByProvince(selectedProvince)
    : [];
  const sectors =
    selectedProvince && selectedDistrict
      ? getSectors(selectedProvince, selectedDistrict)
      : [];
  const cells =
    selectedProvince && selectedDistrict && selectedSector
      ? getCells(selectedProvince, selectedDistrict, selectedSector)
      : [];
  const villages =
    selectedProvince && selectedDistrict && selectedSector && selectedCell
      ? getVillages(
          selectedProvince,
          selectedDistrict,
          selectedSector,
          selectedCell
        )
      : [];

  const handleProvinceChange = (val: string) => {
    setValue("company.address.province", val);
    setValue("company.address.district", "");
    setValue("company.address.sector", "");
    setValue("company.address.cell", "");
    setValue("company.address.village", "");
  };

  const handleDistrictChange = (val: string) => {
    setValue("company.address.district", val);
    setValue("company.address.sector", "");
    setValue("company.address.cell", "");
    setValue("company.address.village", "");
  };

  const handleSectorChange = (val: string) => {
    setValue("company.address.sector", val);
    setValue("company.address.cell", "");
    setValue("company.address.village", "");
  };

  const handleCellChange = (val: string) => {
    setValue("company.address.cell", val);
    setValue("company.address.village", "");
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      id="company-info-form"
    >
      <Controller
        name="company.name"
        control={control}
        render={({ field }) => (
          <TextField
            required
            {...field}
            label={t("company-name", "Company Name")}
            fullWidth
            error={!!errors?.company?.name}
            helperText={errors?.company?.name?.message}
            id="registration-company-name-input"
          />
        )}
      />

      <Controller
        name="company.businessType"
        control={control}
        render={({ field }) => (
          <TextField
            required
            {...field}
            label={t("business-type", "Business Type")}
            error={!!errors?.company?.businessType}
            helperText={errors?.company?.businessType?.message}
            id="registration-businessType-input"
            inputProps={{ "data-testid": "registration-companyName" }}
          />
        )}
      />

      <Controller
        name="company.registrationNumber"
        control={control}
        render={({ field }) => (
          <TextField
            required
            {...field}
            label={t("registration-number", "Registration Number")}
            id="registration-number-input"
            error={!!errors?.company?.registrationNumber}
            helperText={errors?.company?.registrationNumber?.message}
            inputProps={{ "data-testid": "registration-registrationNumber" }}
          />
        )}
      />

      <Controller
        name="company.currencyCode"
        control={control}
        render={({ field }) => {
          return (
            <FormControl style={{ width: "100%" }}>
              <InputLabel shrink id="currency-code-select-label">
                {t("currency-code-label-text", "Currency code")}
              </InputLabel>
              <Select
                {...field}
                labelId="currency-code-select-label"
                id="currency-code-select"
                required
                label={t("currency-code", "Currency Code")}
                fullWidth
                value={field.value || "RWF"}
                inputProps={{ "data-testid": "registration-currencyCode" }}
              >
                {Object.values(SupportedCurrencyCountryMap).map((c) => (
                  <MenuItem
                    key={c.code}
                    value={c.code}
                    id={`registration-currencyCode-${c.code}`}
                  >
                    {t(c.labelTranslationKey, c.label)}
                  </MenuItem>
                ))}
              </Select>
              {errors?.company?.currencyCode?.message && (
                <FormHelperText>
                  {errors?.company?.currencyCode?.message}
                </FormHelperText>
              )}
            </FormControl>
          );
        }}
      />
      <Paper
        variant="outlined"
        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="subtitle1">
          {t("address-label", "Address")}
        </Typography>

        <Controller
          name="company.address.country"
          control={control}
          render={({ field }) => {
            return (
              <FormControl style={{ width: "100%" }}>
                <InputLabel shrink id="country-select-label">
                  {t("country", "Country")}
                </InputLabel>
                <Select
                  {...field}
                  labelId="country-select-label"
                  id="country-selector"
                  required
                  label={t("country", "Country")}
                  fullWidth
                  value={CountryFullName.RW}
                  disabled
                  inputProps={{ "data-testid": "registration-country" }}
                >
                  {Object.values(CountryFullName).map((c) => (
                    <MenuItem
                      key={c}
                      value={c}
                      id={`registration-country-${c}`}
                    >
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.company?.address?.country?.message && (
                  <FormHelperText>
                    {errors?.company?.address?.country?.message}
                  </FormHelperText>
                )}
              </FormControl>
            );
          }}
        />

        <Controller
          name="company.address.province"
          control={control}
          render={({ field }) => (
            <FormControl style={{ width: "100%" }}>
              <InputLabel shrink id="province-select-label">
                {t("province", "Province")}
              </InputLabel>
              <Select
                {...field}
                label={t("province", "Province")}
                labelId="province-select-label"
                fullWidth
                onChange={(e) => {
                  field.onChange(e);
                  handleProvinceChange(e.target.value);
                }}
                disabled={loading}
                error={!!errors?.company?.address?.province}
                id="registration-province"
                inputProps={{ "data-testid": "registration-province" }}
              >
                {provinces.map((prov) => (
                  <MenuItem
                    key={prov}
                    value={prov}
                    id={`registration-province-${prov}`}
                  >
                    {t(locationKey("province", prov), prov)}
                  </MenuItem>
                ))}
              </Select>
              {errors?.company?.address?.province?.message && (
                <FormHelperText>
                  {errors?.company?.address?.province?.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {selectedProvince && (
          <Controller
            name="company.address.district"
            control={control}
            render={({ field }) => (
              <FormControl style={{ width: "100%" }}>
                <InputLabel shrink id="district-select-label">
                  {t("district", "District")}
                </InputLabel>
                <Select
                  {...field}
                  labelId="district-select-label"
                  label={t("district", "District")}
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e);
                    handleDistrictChange(e.target.value);
                  }}
                  error={!!errors?.company?.address?.district}
                  id="registration-district-select"
                  inputProps={{ "data-testid": "registration-district" }}
                >
                  {districts.map((dist: string) => (
                    <MenuItem
                      key={dist}
                      value={dist}
                      id={`registration-district-${dist}`}
                    >
                      {t(locationKey("district", dist), dist)}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.company?.address?.district?.message && (
                  <FormHelperText>
                    {errors?.company?.address?.district?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}

        {selectedDistrict && (
          <Controller
            name="company.address.sector"
            control={control}
            render={({ field }) => (
              <FormControl style={{ width: "100%" }}>
                <InputLabel shrink id="sector-select-label">
                  {t("sector", "Sector")}
                </InputLabel>
                <Select
                  {...field}
                  labelId="sector-select-label"
                  label={t("sector", "Sector")}
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e);
                    handleSectorChange(e.target.value);
                  }}
                  error={!!errors?.company?.address?.sector}
                  id="registration-sector-selector"
                  inputProps={{ "data-testid": "registration-sector" }}
                >
                  {sectors.map((s: string) => (
                    <MenuItem key={s} value={s} id={`registration-sector-${s}`}>
                      {t(locationKey("sector", s), s)}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.company?.address?.sector?.message && (
                  <FormHelperText>
                    {errors?.company?.address?.sector?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}

        {selectedSector && (
          <Controller
            name="company.address.cell"
            control={control}
            render={({ field }) => (
              <FormControl style={{ width: "100%" }}>
                <InputLabel shrink id="cell-select-label">
                  {t("cell", "Cell")}
                </InputLabel>
                <Select
                  {...field}
                  labelId="cell-select-label"
                  label={t("cell", "Cell")}
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e);
                    handleCellChange(e.target.value);
                  }}
                  error={!!errors?.company?.address?.cell}
                  id="registration-cell-selector"
                  inputProps={{ "data-testid": "registration-cell" }}
                >
                  {cells.map((c: string) => (
                    <MenuItem key={c} value={c} id={`registration-cell-${c}`}>
                      {t(locationKey("cell", c), c)}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.company?.address?.cell?.message && (
                  <FormHelperText>
                    {errors?.company?.address?.cell?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}

        {selectedCell && (
          <Controller
            name="company.address.village"
            control={control}
            render={({ field }) => (
              <FormControl style={{ width: "100%" }}>
                <InputLabel shrink id="village-select-label">
                  {t("village", "Village")}
                </InputLabel>
                <Select
                  {...field}
                  labelId="village-select-label"
                  label={t("village", "Village")}
                  fullWidth
                  error={!!errors?.company?.address?.village}
                  id="registration-village-selector"
                  inputProps={{ "data-testid": "registration-village" }}
                >
                  {villages.map((v: string) => (
                    <MenuItem
                      key={v}
                      value={v}
                      id={`registration-village-${v}`}
                    >
                      {t(locationKey("village", v), v)}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.company?.address?.village?.message && (
                  <FormHelperText>
                    {errors?.company?.address?.village?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}
        {selectedVillage && (
          <Controller
            name="company.address.streetAddress"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("street address", "Street Address")}
                fullWidth
                error={!!errors?.company?.address?.streetAddress}
                helperText={errors?.company?.address?.streetAddress?.message}
                inputProps={{ "data-testid": "registration-street-address" }}
              />
            )}
          />
        )}
      </Paper>

      <Controller
        name="company.description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t("description", "Description")}
            multiline
            rows={3}
            id="registration-description-text-area"
            inputProps={{ "data-testid": "registration-description" }}
          />
        )}
      />
    </Box>
  );
};

export default CompanyInfoForm;
