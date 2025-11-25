import React, { useContext } from "react";
import {
  KivuEnvConfigContext,
  PhoneCountryCodeMap,
  useKivunovaTranslation
} from "@kivunova/kivufrontendcommon";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { RegistrationData } from "./types/registrationTypes";

interface AdminInfoFormProps {
  control: Control<RegistrationData>;
  errors: FieldErrors<RegistrationData>;
}

const AdminInfoForm: React.FC<AdminInfoFormProps> = ({ control, errors }) => {
  const { t } = useKivunovaTranslation();
  const { countryCode } = useContext(KivuEnvConfigContext);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Controller
        name="admin.firstName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t("first-name", "First name")}
            fullWidth
            error={!!errors?.admin?.firstName}
            helperText={errors?.admin?.firstName?.message}
            inputProps={{ "data-testid": "registration-firstName" }}
          />
        )}
      />
      <Controller
        name="admin.lastName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t("last-name", "Last name")}
            fullWidth
            error={!!errors?.admin?.lastName}
            helperText={errors?.admin?.lastName?.message}
            inputProps={{ "data-testid": "registration-lastName" }}
          />
        )}
      />
      <Controller
        name="admin.email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t("email", "Email")}
            fullWidth
            error={!!errors?.admin?.email}
            helperText={errors?.admin?.email?.message}
            inputProps={{ "data-testid": "registration-email" }}
          />
        )}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Controller
          name="admin.phoneCountryCode"
          control={control}
          defaultValue={PhoneCountryCodeMap[countryCode].countryCode}
          render={({ field }) => (
            <FormControl style={{ width: "200px" }}>
              <InputLabel shrink id="phone-country-code-select-label">
                {t("phone-country-code-label-text", "Country Code")}
              </InputLabel>
              <Select
                {...field}
                labelId="phone-country-code-select-label"
                id="phone-country-code-select"
                value={field.value}
                onChange={(event) => {
                  const selected = event.target.value;
                  field.onChange(selected);
                }}
                displayEmpty
              >
                {Object.keys(PhoneCountryCodeMap).map((country) => (
                  <MenuItem
                    key={PhoneCountryCodeMap[country].code}
                    value={country}
                  >
                    {`${PhoneCountryCodeMap[country].flag} (${PhoneCountryCodeMap[country].code})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="admin.phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("phone", "Phone")}
              fullWidth
              error={!!errors?.admin?.phone}
              helperText={errors?.admin?.phone?.message}
              id="registration-phone-country-code"
              inputProps={{ "data-testid": "registration-phone" }}
            />
          )}
        />
      </Box>
      <Controller
        name="admin.password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t("password", "Password")}
            type="password"
            fullWidth
            error={!!errors?.admin?.password}
            helperText={errors?.admin?.password?.message}
            inputProps={{ "data-testid": "registration-password" }}
          />
        )}
      />
    </Box>
  );
};

export default AdminInfoForm;
