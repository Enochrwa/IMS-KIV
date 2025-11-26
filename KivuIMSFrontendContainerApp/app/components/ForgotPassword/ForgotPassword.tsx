import React, { useContext, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Link,
  CircularProgress
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
  useKivunovaTranslation,
  KivuI18nContext,
  localizedPath
} from "@kivunova/kivufrontendcommon";
import { PAGE_ROUTE_LOGIN } from "../../PageRoutes";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { forgotPasswordSchema } from "./constants/forgotPasswordYupSchema";
import { linkButtonSx } from "../common/buttonStyles";
import SmallScreenFooter from "../common/SmallScreenFooter";
import useForgotPassword from "../../hooks/api/useForgotPassword";
import AlertBannerContext from "../../context/alertBannerContext";
import { ForgotPasswordData } from "./types/forgotPasswordTypes";

import {
  ALERT_BANNER_CODE,
  ALERT_BANNER_CODE_SEVERITY
} from "../../Enums/alertCode";
import { FORGOT_PWD_STEP } from "./Enums/forgotPasswordSteps";

const ForgotOtpForm: React.FC<{
  setNextStep: (step: FORGOT_PWD_STEP) => void;
  setEmail: (email: string) => void;
}> = ({ setNextStep, setEmail }) => {
  const { t } = useKivunovaTranslation();
  const navigate = useNavigate();
  const { language, defaultLang } = useContext(KivuI18nContext);
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  const { setAlert } = useContext(AlertBannerContext);
  const forgotPasswordMutation = useForgotPassword();
  const isLoading = forgotPasswordMutation.isPending;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange"
  });

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const onSubmit = (data: ForgotPasswordData) => {
    if (forgotPasswordMutation.isPending) return;

    forgotPasswordMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setEmail(data.email);
          setNextStep(FORGOT_PWD_STEP.VALIDATE_OTP);
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

  return (
    <Paper
      elevation={0}
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
        fontWeight="bold"
        gutterBottom
      >
        {t("auth-forgot-password-title", "Forgot Password")}
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          gap: 5,
          flexDirection: "column"
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        data-testid="forgot-password-form"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              inputRef={emailInputRef}
              label={t("email", "Email")}
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              inputProps={{
                "data-testid": "forgot-password-email",
                "aria-label": "Email address",
                "aria-describedby": errors.email ? "email-error" : undefined
              }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            mt: 4,
            backgroundColor: BRAND_COLOR,
            color: "#fff",
            "&:hover": { backgroundColor: BRAND_HOVER },
            "&:disabled": { backgroundColor: "#ccc", color: "#666" }
          }}
          data-testid="forgot-password-submit"
          aria-label={"Submit password reset"}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: "#fff" }} />
              {t("auth-forgot-password-sending", "Sending...")}
            </>
          ) : (
            t("auth-forgot-password-submit", "Reset Password")
          )}
        </Button>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography variant="body2">
            {t(
              "auth-forgot-password-remember-password",
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
              data-testid="forgot-password-to-login"
              aria-label="Return to login page"
            >
              {t("auth-forgot-password-login-link", "Login")}
            </Link>
          </Typography>
        </Box>
      </Box>
      <SmallScreenFooter />
    </Paper>
  );
};

export default ForgotOtpForm;
