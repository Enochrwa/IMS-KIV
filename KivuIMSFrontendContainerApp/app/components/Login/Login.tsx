import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import AuthSidePanel from "../common/AuthSidePanel/AuthSidePanel";
import AuthRightSidePanel from "../common/AuthSidePanel/AuthRightSidePanel";
import LoginForm from "./LoginForm";
import { AUTH_STATUS } from "../../context/enums/authEnums";
import OtpVerification from "../common/OtpVerification/OtpVerification";
import AuthContext from "../../context/authContext";

const Login: React.FC = () => {
  const { authContextInfo, updateAuthContextInfo } = useContext(AuthContext);
  const [loginInfo, setLoginInfo] = useState<string | undefined>();

  const backToLogin = () => {
    updateAuthContextInfo({
      ...authContextInfo,
      auth: {
        status: AUTH_STATUS.UNAUTHENTICATED
      }
    });
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
        {authContextInfo.auth.status === AUTH_STATUS.VERIFY_EMAIL_REQUIRED &&
        loginInfo ? (
          <OtpVerification
            otpType="email"
            onBackToLogin={backToLogin}
            onVerifySuccess={backToLogin}
            loginInfo={loginInfo}
          />
        ) : (
          <LoginForm setLoginInfo={setLoginInfo} />
        )}
      </AuthRightSidePanel>
    </Box>
  );
};

export default Login;
