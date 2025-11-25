import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import { RegistrationData } from "./types/registrationTypes";
import {
  CountryFullName,
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
import React from "react";

interface StoreInfoFormProps {
  control: Control<RegistrationData>;
  errors: FieldErrors<RegistrationData>;
  watch: UseFormWatch<RegistrationData>;
  setValue: UseFormSetValue<RegistrationData>;
}

const StoreInfoForm: React.FC<StoreInfoFormProps> = ({
  control,
  errors,
  watch,
  setValue
}) => {
  const { t } = useKivunovaTranslation();
  // Note: locationKey used for translation keys for places
  const locationKey = (type: string, name: string) =>
    `location.${type}.${name}`;
  const {
    getProvinces,
    getDistrictByProvince,
    getSectors,
    getCells,
    getVillages,
    loading
  } = useRwandaLocation();

  const provinces = getProvinces();
  const selectedProvince = watch("store.address.province");
  const selectedDistrict = watch("store.address.district");
  const selectedSector = watch("store.address.sector");
  const selectedCell = watch("store.address.cell");
  const selectedVillage = watch("store.address.village");

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
    setValue("store.address.province", val);
    setValue("store.address.district", "");
    setValue("store.address.sector", "");
    setValue("store.address.cell", "");
    setValue("store.address.village", "");
  };

  const handleDistrictChange = (val: string) => {
    setValue("store.address.district", val);
    setValue("store.address.sector", "");
    setValue("store.address.cell", "");
    setValue("store.address.village", "");
  };

  const handleSectorChange = (val: string) => {
    setValue("store.address.sector", val);
    setValue("store.address.cell", "");
    setValue("store.address.village", "");
  };

  const handleCellChange = (val: string) => {
    setValue("store.address.cell", val);
    setValue("store.address.village", "");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Controller
        name="store.name"
        control={control}
        render={({ field }) => (
          <TextField
            required
            {...field}
            label={t("store-name", "Store Name")}
            fullWidth
            error={!!errors?.store?.name}
            helperText={errors?.store?.name?.message}
            inputProps={{ "data-testid": "registration-storeName" }}
          />
        )}
      />
      <Paper
        variant="outlined"
        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="subtitle1">
          {t("address-label", "Address")}
        </Typography>

        <Controller
          name="store.address.country"
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
                >
                  {Object.values(CountryFullName).map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.store?.address?.country?.message && (
                  <FormHelperText>
                    {errors?.store?.address?.country?.message}
                  </FormHelperText>
                )}
              </FormControl>
            );
          }}
        />

        <Controller
          name="store.address.province"
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
                error={!!errors?.store?.address?.province}
                id="registration-province"
              >
                {provinces.map((prov) => (
                  <MenuItem key={prov} value={prov}>
                    {t(locationKey("province", prov), prov)}
                  </MenuItem>
                ))}
              </Select>
              {errors?.store?.address?.province?.message && (
                <FormHelperText>
                  {errors?.store?.address?.province?.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {selectedProvince && (
          <Controller
            name="store.address.district"
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
                  error={!!errors?.store?.address?.district}
                  id="registration-district-select"
                >
                  {districts.map((dist: string) => (
                    <MenuItem key={dist} value={dist}>
                      {t(locationKey("district", dist), dist)}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.store?.address?.district?.message && (
                  <FormHelperText>
                    {errors?.store?.address?.district?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}

        {selectedDistrict && (
          <Controller
            name="store.address.sector"
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
                  error={!!errors?.store?.address?.sector}
                  id="registration-sector-selector"
                >
                  {sectors.map((s: string) => (
                    <MenuItem key={s} value={s}>
                      {t(locationKey("sector", s), s)}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.store?.address?.sector?.message && (
                  <FormHelperText>
                    {errors?.store?.address?.sector?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}

        {selectedSector && (
          <Controller
            name="store.address.cell"
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
                  error={!!errors?.store?.address?.cell}
                  id="registration-cell-selector"
                >
                  {cells.map((c: string) => (
                    <MenuItem key={c} value={c}>
                      {t(locationKey("cell", c), c)}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.store?.address?.cell?.message && (
                  <FormHelperText>
                    {errors?.store?.address?.cell?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}

        {selectedCell && (
          <Controller
            name="store.address.village"
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
                  error={!!errors?.store?.address?.village}
                  id="registration-villag-selectore"
                >
                  {villages.map((v: string) => (
                    <MenuItem key={v} value={v}>
                      {t(locationKey("village", v), v)}
                    </MenuItem>
                  ))}
                </Select>
                {errors?.store?.address?.village?.message && (
                  <FormHelperText>
                    {errors?.store?.address?.village?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}

        {selectedVillage && (
          <Controller
            name="store.address.streetAddress"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("street address", "Street Address")}
                fullWidth
                error={!!errors?.store?.address?.streetAddress}
                helperText={errors?.store?.address?.streetAddress?.message}
                inputProps={{ "data-testid": "registration-street-address" }}
              />
            )}
          />
        )}
      </Paper>
    </Box>
  );
};

export default StoreInfoForm;
