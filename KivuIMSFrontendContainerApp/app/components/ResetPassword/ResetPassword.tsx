import React, { useContext, useEffect } from "react";
import { Box, Link, Paper, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  KivuI18nContext,
  localizedPath,
  useKivunovaTranslation
} from "@kivunova/kivufrontendcommon";
import { PAGE_ROUTE_LOGIN } from "../../PageRoutes";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { linkButtonSx } from "../common/buttonStyles";
import AlertBannerContext from "../../context/alertBannerContext";
import {
  ALERT_BANNER_CODE,
  ALERT_BANNER_CODE_SEVERITY
} from "../../Enums/alertCode";
import type { ResetPasswordForm } from "../../types/password";
import useResetPassword from "../../hooks/api/useResetPassword";

const ResetPasswordForm: React.FC<{
  token: string;
  handleSuccess: () => void;
}> = ({ token, handleSuccess }) => {
  const { t } = useKivunovaTranslation();
  const navigate = useNavigate();
  const { language, defaultLang } = useContext(KivuI18nContext);

  const { setAlert } = useContext(AlertBannerContext);

  const resetPasswordSchema = yup.object({
    newPassword: yup
      .string()
      .min(
        8,
        t(
          "auth-reset-password-min-length",
          "Password must be at least 8 characters"
        )
      )
      .required(
        t("auth-reset-password-new-required", "New password is required")
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("newPassword")],
        t("auth-reset-password-match", "Passwords must match")
      )
      .required(
        t(
          "auth-reset-password-confirm-required",
          "Confirm password is required"
        )
      )
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onChange"
  });

  // Watch newPassword for confirm password validation
  watch("newPassword");

  useEffect(() => {
    if (!token) {
      // if token missing, handle error
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: ALERT_BANNER_CODE.INTERNAL_SERVER_ERROR
      });
    }
  }, [token, setAlert]);

  const resetMutation = useResetPassword();
  const isLoading = resetMutation.isPending;

  const onSubmit = async (data: ResetPasswordForm) => {
    if (isLoading) return;

    try {
      await resetMutation.mutateAsync({
        verificationToken: token,
        newPassword: data.newPassword
      });
      // on success call handleSuccess
      handleSuccess();
    } catch {
      // fetchGraphQL already maps errors to alert banner; set a safe fallback alert
      setAlert({
        severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
        code: ALERT_BANNER_CODE.INTERNAL_SERVER_ERROR
      });
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 6,
        position: "relative"
      }}
    >
      <Typography
        textAlign="center"
        variant="h5"
        component="h1"
        gutterBottom
        align="center"
      >
        {t("auth-reset-password-title", "Reset Password")}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 2 }}
      >
        {t(
          "auth-reset-password-subtitle",
          "Enter the OTP sent to your email and set a new password"
        )}
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2
        }}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        data-testid="reset-password-form"
      >
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("auth-reset-password-new-password", "New Password")}
              type="password"
              fullWidth
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              inputProps={{
                "data-testid": "reset-password-new-password",
                "aria-label": t(
                  "auth-reset-password-new-password-aria",
                  "New password"
                )
              }}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t(
                "auth-reset-password-confirm-password",
                "Confirm Password"
              )}
              type="password"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              inputProps={{
                "data-testid": "reset-password-confirm-password",
                "aria-label": t(
                  "auth-reset-password-confirm-password-aria",
                  "Confirm password"
                )
              }}
            />
          )}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
          sx={{
            mt: 4,
            backgroundColor: BRAND_COLOR,
            color: "#fff",
            "&:hover": { backgroundColor: BRAND_HOVER },
            "&:disabled": { backgroundColor: "#ccc", color: "#666" }
          }}
          data-testid="reset-password-submit"
          aria-label={t("auth-reset-password-submit-aria", "Update password")}
        >
          {t("auth-reset-password-submit", "Update Password")}
        </LoadingButton>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography variant="body2">
            {t(
              "auth-reset-password-remember-password",
              "Remember your password?"
            )}
            &nbsp;
            <Link
              component="button"
              type="button"
              underline="hover"
              sx={linkButtonSx}
              onClick={() =>
                navigate(localizedPath(PAGE_ROUTE_LOGIN, language, defaultLang))
              }
              data-testid="reset-password-to-login"
              aria-label={t(
                "auth-reset-password-login-link-aria",
                "Return to login page"
              )}
            >
              {t("auth-reset-password-login-link", "Login")}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export { ResetPasswordForm };
