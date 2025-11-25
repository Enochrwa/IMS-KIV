import React, { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setProfileData } from "../../store/slices/profileSlice";
import { useUpdateProfile } from "../../hooks/api/useProfile";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";
import { PhoneCountryCodeMap } from "@kivunova/kivufrontendcommon";
import { UpdateProfileFormData } from "./types/profileTypes";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";

interface ProfileEditFormProps {
  onClose: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onClose }) => {
  const { t } = useKivunovaTranslation();
  const dispatch = useDispatch();
  const { profileData } = useSelector((state: RootState) => state.profile);
  const updateProfile = useUpdateProfile();

  // ✅ Yup validation schema
  const schema = Yup.object({
    firstName: Yup.string().required(
      t("first-name-required", "First name is required")
    ),
    lastName: Yup.string().required(
      t("last-name-required", "Last name is required")
    ),
    email: Yup.string()
      .email(t("invalid-email", "Invalid email format"))
      .required(t("email-required", "Email is required")),
    phone: Yup.string().required(t("phone-required", "Phone is required")),
    phoneCountryCode: Yup.string().required(
      t("country-code-required", "Country code is required")
    )
  });

  // ✅ Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: profileData || {}
  });

  // Populate form when Redux updates
  useEffect(() => {
    if (profileData) reset(profileData);
  }, [profileData, reset]);

  // ✅ Handle form submission
  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      const result = await updateProfile.mutateAsync(data);
      if (result?.updateProfile) {
        dispatch(setProfileData(result.updateProfile));
        onClose();
      }
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <Box sx={{ width: "100%", gap: 3 }}>
      <Box sx={{ mb: 4, width: "100%" }}>
        <Typography textAlign="center" variant="h5" color="textPrimary">
          Edit your profile
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 1
        }}
        noValidate
      >
        {/* First Name */}
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("first-name", "First Name")}
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          )}
        />

        {/* Last Name */}
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("last-name", "Last Name")}
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="email"
              label={t("email", "Email")}
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        {/* Phone + Country Code */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel shrink>
              {t("phone-country-code", "Country Code")}
            </InputLabel>
            <Controller
              name="phoneCountryCode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("phone-country-code", "Country Code")}
                >
                  {Object.keys(PhoneCountryCodeMap).map((key) => (
                    <MenuItem
                      key={key}
                      value={key}
                    >{`${PhoneCountryCodeMap[key].flag} ${PhoneCountryCodeMap[key].code}`}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("phone", "Phone")}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={updateProfile.isPending}
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
    </Box>
  );
};

export default ProfileEditForm;
