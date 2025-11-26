import React, { useContext } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
  KivuI18nContext,
  localizedPath,
  useKivunovaTranslation
} from "@kivunova/kivufrontendcommon";
import useLogin from "../../hooks/api/useLogin";
import { PAGE_ROUTE_FORGOT_PASSWORD } from "../../PageRoutes";
import {
  BRAND_COLOR,
  BRAND_DISABLED,
  BRAND_HOVER
} from "../common/constants/colors";

import type { LoginFormData } from "./types/login.types";

export interface LoginFormProps {
  setLoginInfo: (loginInfo: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLoginInfo }) => {
  const navigate = useNavigate();
  const { t } = useKivunovaTranslation();
  const { language, defaultLang } = useContext(KivuI18nContext);
  const loginMutation = useLogin();
  const isPending = loginMutation.isPending;

  const schema = yup.object<LoginFormData>().shape({
    email: yup
      .string()
      .email(t("email-empty-error", "Enter a valid email"))
      .required(t("email-invalid-error", "Email is required")),
    password: yup
      .string()
      .required(t("password-empty-password", "Password is required"))
      .min(
        8,
        t("password-invalid-error", "Password should be at least 8 characters")
      ),
    remember: yup.boolean().default(false)
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "", remember: false }
  });

  const handleClick = async (loginData: LoginFormData) => {
    try {
      // set loginInfo
      setLoginInfo(loginData.email);
      await loginMutation.mutateAsync({
        email: loginData.email,
        password: loginData.password
      });
    } catch (e) {
      console.error("failed to login", e);
    }
  };

  return (
    <Paper
      elevation={0}
      square
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 6,
        position: "relative"
      }}
      data-testid="login-right-panel"
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t("login-text", "Login")}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {t(
          "login-welcome-back-text",
          "Welcome back! Please enter your details."
        )}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(handleClick)}
        sx={{ width: "100%", maxWidth: 400 }}
        noValidate
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="email"
              label={t("email-input-label", "Email")}
              placeholder={t("email-input-placeholder", "Enter your email")}
              margin="normal"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isPending}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="password"
              label={t("password-input-label", "Password")}
              type="password"
              placeholder={t(
                "password-input-placeholder",
                "Enter your password"
              )}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isPending}
            />
          )}
        />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
        >
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox {...field} checked={field.value} color="primary" />
                }
                label={t("remember-me-input-label", "Remember me")}
              />
            )}
          />
          <Link
            component="button"
            underline="hover"
            sx={{ fontSize: "0.9rem", color: BRAND_COLOR }}
            onClick={() =>
              navigate(
                localizedPath(PAGE_ROUTE_FORGOT_PASSWORD, language, defaultLang)
              )
            }
          >
            {t("forgot-password-link-text", "Forgot password?")}
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isPending}
          sx={{
            mt: 3,
            backgroundColor: BRAND_COLOR,
            "&:hover": { backgroundColor: BRAND_HOVER },
            "&:disabled": { backgroundColor: BRAND_DISABLED },
            textTransform: "none",
            py: 1.2,
            fontSize: "1rem"
          }}
        >
          {t("login-button-text", "Log in")}
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginForm;
