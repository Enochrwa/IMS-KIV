import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { BRAND_COLOR, BRAND_HOVER } from "../constants/colors";
import { OTPType } from "./types/otpVerification";

export interface OtpVerificationProps {
  otpType: OTPType;
  onBackToLogin: () => void;
  handleSubmitOtp: (otp: string) => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  otpType,
  onBackToLogin,
  handleSubmitOtp
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      } else if (!value && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      setError("");
      handleSubmitOtp?.(otpValue);
    } else {
      setError("Please fill in all 6 digits before submitting.");
    }
  };

  const verbiage =
    otpType === "phone"
      ? "We’ve sent a 6-digit verification code to your mobile number."
      : "We’ve sent a 6-digit verification code to your email address.";

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 360,
          textAlign: "center",
          p: 4,
          borderRadius: 4,
          border: "1px solid #5b36b0", // purple border to match IMS theme
          boxShadow: "0px 4px 20px rgba(123, 97, 255, 0.2)", // soft purple glow
          backgroundColor: "white"
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="h5" fontWeight="bold" mb={1} color="#6f49c9">
          OTP Verification
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {verbiage}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="center" gap={1} mb={2}>
            {otp.map((value, index) => (
              <TextField
                key={index}
                id={`otp-${index}`}
                value={value}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "1.5rem",
                    width: "45px",
                    height: "35px",
                    borderRadius: "8px"
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: BRAND_HOVER },
                    "&:hover fieldset": { borderColor: BRAND_HOVER },
                    "&.Mui-focused fieldset": { borderColor: BRAND_COLOR }
                  }
                }}
              />
            ))}
          </Box>

          {error && (
            <Typography variant="body2" color="error" mb={2}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: BRAND_COLOR,
              "&:hover": { backgroundColor: BRAND_HOVER },
              py: 1.2,
              borderRadius: 2,
              fontWeight: "bold"
            }}
          >
            Submit
          </Button>
        </form>

        <Button
          variant="text"
          onClick={onBackToLogin}
          sx={{ mt: 3, color: BRAND_COLOR, fontWeight: "medium" }}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default OtpVerification;