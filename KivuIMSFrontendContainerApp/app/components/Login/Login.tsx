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

import type { LoginFormData } from "./types/login.types";
import {
  PAGE_PORTAL_DASHBOARD,
  PAGE_ROUTE_FORGOT_PASSWORD,
  PAGE_ROUTE_REGISTRATION,
  PORTAL_PREFIX
} from "../../PageRoutes";
import {
  BRAND_COLOR,
  BRAND_DISABLED,
  BRAND_HOVER
} from "../common/constants/colors";
import AuthSidePanel from "../common/AuthSidePanel/AuthSidePanel";
import AuthRightSidePanel from "../common/AuthSidePanel/AuthRightSidePanel";
import useLogin from "../../hooks/api/useLogin";

const Login: React.FC = () => {
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
      .min(
        8,
        t("password-invalid-error", "Password should be at least 8 characters")
      )
      .required(t("password-empty-password", "Password is required")),
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

  // Dummy submit function for UI-only PR
  const handleClick = async (loginData: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(
        {
          email: loginData.email,
          password: loginData.password
        },
        {
          onSuccess: () => {
            navigate(
              localizedPath(
                `${PORTAL_PREFIX}/${PAGE_PORTAL_DASHBOARD}`,
                language,
                defaultLang
              )
            );
          }
        }
      );
    } catch (e) {
      console.error("failed to login", e);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100wh",
        background: "white",
        position: "relative"
      }}
    >
      {/* Left side */}
      <Box
        sx={{
          display: { xs: "none", md: "none", lg: "flex", xl: "flex" },
          flex: 1
        }}
      >
        <AuthSidePanel />
      </Box>

      {/* Right side */}
      <AuthRightSidePanel>
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
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            data-testid="login-title"
          >
            {t("login-text", " Login")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            data-testid="login-subtitle"
          >
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
            data-testid="login-form"
          >
            {/* REMOVE: Loading bar from useLogin */}
            {/* {isPending && (
            <Stack width="100%" paddingBottom="1em" alignSelf="center">
              <LinearProgress sx={{ borderRadius: 1 }} />
            </Stack>
          )} */}

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
                  inputProps={{ "data-testid": "login-email" }}
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
                  inputProps={{ "data-testid": "login-password" }}
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
                      <Checkbox
                        {...field}
                        checked={field.value}
                        color="primary"
                        disabled={isPending}
                        inputProps={
                          {
                            "data-testid": "login-remember"
                          } as React.InputHTMLAttributes<HTMLInputElement>
                        }
                      />
                    }
                    label={t("remember-me-input-label", "Remember me")}
                  />
                )}
              />
              <Link
                component="button"
                type="button"
                underline="hover"
                sx={{ fontSize: "0.9rem", color: BRAND_COLOR }}
                onClick={() =>
                  navigate(
                    localizedPath(
                      PAGE_ROUTE_FORGOT_PASSWORD,
                      language,
                      defaultLang
                    )
                  )
                }
                data-testid="login-forgot-password"
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
              data-testid="login-submit"
            >
              {t("login-button-text", "Login in")}
            </Button>

            <Typography
              variant="body2"
              align="center"
              mt={3}
              data-testid="login-signup-text"
            >
              {t("no-account-question-text", " Don't have an account?")}&nbsp;
              <Link
                component="button"
                type="button"
                underline="hover"
                sx={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  color: BRAND_COLOR
                }}
                onClick={() =>
                  navigate(
                    localizedPath(
                      PAGE_ROUTE_REGISTRATION,
                      language,
                      defaultLang
                    )
                  )
                }
                data-testid="login-signup"
              >
                {t("sinput-link-text", "Sign up")}
              </Link>
            </Typography>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "16px",
              left: "0px",
              display: {
                sm: "flex",
                xs: "flex",
                md: "none",
                lg: "none",
                xl: "none"
              },
              justifyContent: "center",
              width: "100%"
            }}
          >
            <Typography
              variant="caption"
              sx={{ width: "100%" }}
              data-testid="login-left-footer"
              textAlign="center"
            >
              © kivunova 2025
            </Typography>
          </Box>
        </Paper>
      </AuthRightSidePanel>
    </Box>
  );
};

export default Login;
