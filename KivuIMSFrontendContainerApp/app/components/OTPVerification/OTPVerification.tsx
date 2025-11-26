import React, { useContext } from "react";
import { Box, Link, Paper, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";
import { BRAND_COLOR } from "../common/constants/colors";
import { linkButtonSx } from "../common/buttonStyles";
import AlertBannerContext from "../../context/alertBannerContext";
import {
  ALERT_BANNER_CODE,
  ALERT_BANNER_CODE_SEVERITY
} from "../../Enums/alertCode";
import { OTPVerificationData } from "./types/otpVerificationTypes";
import useVerifyOTP from "../../hooks/api/useVerifyOTP";
import { FORGOT_PWD_STEP } from "../ForgotPassword/Enums/forgotPasswordSteps";
import useRequestVerificationOtp from "../../hooks/api/useRequestVerificationOtp";

const OtpValidation: React.FC<{
  email: string;
  setNextStep: (step: FORGOT_PWD_STEP) => void;
  setupToken: (token: string) => void;
}> = ({ email, setNextStep, setupToken }) => {
  const { t } = useKivunovaTranslation();

  const { setAlert } = useContext(AlertBannerContext);

  const otpSchema = yup.object({
    otp: yup
      .string()
      .required(t("auth-otp-required", "OTP is required"))
      .matches(/^\d{6}$/, t("auth-otp-invalid", "OTP must be 6 digits"))
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<OTPVerificationData>({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onChange"
  });

  const verifyOTPMutation = useVerifyOTP();
  const resendOTPMutation = useRequestVerificationOtp();
  const isLoading = verifyOTPMutation.isPending;
  const isResending = resendOTPMutation.isPending;

  const resendOtp = () => {
    if (isResending) return;

    resendOTPMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setAlert({
            severity: ALERT_BANNER_CODE_SEVERITY.SUCCESS,
            code: ALERT_BANNER_CODE.RESEND_OTP_SUCCESS
          });
        },
        onError: () => {
          setAlert({
            severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
            code: ALERT_BANNER_CODE.INTERNAL_SERVER_ERROR
          });
        }
      }
    );
  };

  const onSubmit = (data: OTPVerificationData) => {
    if (isLoading) return;

    verifyOTPMutation.mutate(
      {
        email,
        otp: data.otp
      },
      {
        onSuccess: (result) => {
          setupToken(result.verifyEmailOtp.verificationToken || "dummy-token");
          setNextStep(FORGOT_PWD_STEP.RESET);
        },
        onError: () => {
          setAlert({
            severity: ALERT_BANNER_CODE_SEVERITY.ERROR,
            code: ALERT_BANNER_CODE.INVALID_OTP
          });
        }
      }
    );
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
        {t("auth-otp-verification-title", "Verify OTP")}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 2 }}
      >
        {t(
          "auth-otp-verification-subtitle",
          "Enter the 6-digit code sent to your email"
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
        data-testid="otp-verification-form"
      >
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("auth-otp-code", "OTP Code")}
              type="text"
              fullWidth
              error={!!errors.otp}
              helperText={errors.otp?.message}
              inputProps={{
                "data-testid": "otp-verification-code",
                "aria-label": t("auth-otp-code", "OTP Code"),
                maxLength: 6
              }}
            />
          )}
        />

        <LoadingButton
          type="submit"
          loading={isLoading}
          variant="contained"
          fullWidth
          sx={{ mt: 4, backgroundColor: BRAND_COLOR, color: "#fff" }}
          data-testid="otp-verification-submit"
          aria-label={t("auth-otp-verify", "Verify OTP")}
        >
          {t("auth-otp-verify", "Verify OTP")}
        </LoadingButton>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography variant="body2">
            {t("auth-otp-didnt-receive", "Didn't receive the code?")}
            &nbsp;
            <Link
              component="button"
              type="button"
              underline="hover"
              sx={linkButtonSx}
              onClick={resendOtp}
              data-testid="otp-verification-resend"
              aria-label={t("auth-otp-resend-aria", "Resend OTP")}
            >
              {t("auth-otp-resend", "Resend")}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export { OtpValidation };
