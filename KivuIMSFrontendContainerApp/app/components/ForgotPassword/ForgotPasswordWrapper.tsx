import React, { ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KivuI18nContext, localizedPath } from "@kivunova/kivufrontendcommon";
import ForgotOtpForm from "./ForgotPassword";
import { OtpValidation } from "../OTPVerification/OTPVerification";
import { ResetPasswordForm } from "../ResetPassword/ResetPassword";
import { FORGOT_PWD_STEP } from "./Enums/forgotPasswordSteps";
import { PAGE_ROUTE_LOGIN } from "../../PageRoutes";
import { Box } from "@mui/material";
import AuthSidePanel from "../common/AuthSidePanel/AuthSidePanel";
import AuthRightSidePanel from "../common/AuthSidePanel/AuthRightSidePanel";
import SmallScreenFooter from "../common/SmallScreenFooter";

/**
 * Wrapper component that manages the flow of the "Forgot Password" process.
 * It handles switching between three main steps:
 * 1. Requesting OTP
 * 2. Validating OTP
 * 3. Resetting password
 */
const ForgotPasswordWrapper = () => {
  const navigate = useNavigate();
  const { language, defaultLang } = useContext(KivuI18nContext);

  // Track the current step in the forgot password process
  const [currentStep, setCurrentStep] = useState<FORGOT_PWD_STEP>(
    FORGOT_PWD_STEP.INITIAL
  );

  // Store user's email so it can be passed between steps
  const [email, setEmail] = useState<string>("");

  // Store the session or reset token received after OTP validation
  const [token, setToken] = useState<string>("");

  /**
   * Callback to handle successful password reset.
   * You could redirect the user, show a success message, or reset the form state.
   */
  const handleSuccess = () => {
    // Redirect to login page
    navigate(localizedPath(PAGE_ROUTE_LOGIN, language, defaultLang));
  };

  // forgot password content
  let content: ReactNode;

  // STEP 4: Reset password form (after OTP validation)
  if (currentStep === FORGOT_PWD_STEP.RESET) {
    content = <ResetPasswordForm token={token} handleSuccess={handleSuccess} />;
  }

  // STEP 3: Resend OTP screen (if user chooses to resend)
  else if (currentStep === FORGOT_PWD_STEP.RESEND_OTP) {
    content = (
      <ForgotOtpForm setNextStep={setCurrentStep} setEmail={setEmail} />
    );
  }

  // STEP 2: OTP validation screen
  else if (currentStep === FORGOT_PWD_STEP.VALIDATE_OTP) {
    content = (
      <OtpValidation
        email={email}
        setNextStep={setCurrentStep}
        setupToken={setToken}
      />
    );
  }

  // STEP 1: Request OTP form (initial screen)
  else {
    content = (
      <ForgotOtpForm setNextStep={setCurrentStep} setEmail={setEmail} />
    );
  }

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
      <AuthRightSidePanel>{content}</AuthRightSidePanel>
      <SmallScreenFooter />
    </Box>
  );
};

export default ForgotPasswordWrapper;
