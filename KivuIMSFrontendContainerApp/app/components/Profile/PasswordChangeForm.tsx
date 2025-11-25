import React from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  TextField,
  Button,
  Container,
  useTheme
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useChangePassword } from "../../hooks/api/useProfile";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";
import {
  BRAND_COLOR,
  BRAND_HOVER,
  BRAND_DISABLED
} from "../common/constants/colors";
import { PasswordFormData } from "./types/profileTypes";
import useMediaQuery from "@mui/material/useMediaQuery";

const PasswordChangeForm: React.FC = () => {
  const { t } = useKivunovaTranslation();
  const changePassword = useChangePassword();
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));

  const schema = Yup.object({
    currentPassword: Yup.string().required(
      t("current-password-required", "Current password is required")
    ),
    newPassword: Yup.string()
      .required(t("new-password-required", "New password is required"))
      .min(8, t("new-password-min", "Password must be at least 8 characters")),
    confirmPassword: Yup.string()
      .required(t("confirm-password-required", "Please confirm your password"))
      .oneOf(
        [Yup.ref("newPassword")],
        t("passwords-must-match", "Passwords must match")
      )
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      reset();
    } catch (err) {
      console.error("Password change failed:", err);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Card
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            p: { xs: 2, sm: 3 }
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={600}
              color="text.primary"
              sx={{ mb: 1 }}
            >
              {t("change-password-title", "Change Password")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 450 }}
            >
              {t(
                "change-password-description",
                "Update your account password below. Make sure your new password is strong and secure."
              )}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                pt: 3,
                gap: 3,
                width: matchMD ? "100%" : "50%",
                margin: "auto"
              }}
            >
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label={t("current-password", "Current Password")}
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                  />
                )}
              />

              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label={t("new-password", "New Password")}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label={t("confirm-password", "Confirm New Password")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={changePassword.isPending}
                  sx={{
                    flex: 1,
                    mt: { xs: 2, sm: 0 },
                    textTransform: "none",
                    borderRadius: 2,
                    backgroundColor: BRAND_COLOR,
                    color: "white",
                    "&:hover": { backgroundColor: BRAND_HOVER },
                    "&:disabled": { backgroundColor: BRAND_DISABLED }
                  }}
                >
                  {t("change-password", "Change Password")}
                </LoadingButton>

                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => reset()}
                  disabled={changePassword.isPending}
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
                  {t("reset-form", "Reset")}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PasswordChangeForm;
