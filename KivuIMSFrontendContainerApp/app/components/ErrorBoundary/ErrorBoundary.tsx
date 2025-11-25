import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Box, Button, Typography } from "@mui/material";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";

interface Props {
  children: React.ReactNode;
}

const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ resetErrorBoundary }) => {
  const { t } = useKivunovaTranslation();

  const reset = () => {
    resetErrorBoundary();
    // reload the page to reset global state if necessary
    window.location.reload();
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }} role="alert">
      <Typography variant="h5" gutterBottom>
        {t("error-boundary-title", "Something went wrong")}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {t(
          "error-boundary-description",
          "An unexpected error occurred. Please refresh the page or contact support."
        )}
      </Typography>
      <Button variant="contained" onClick={reset} data-testid="error-reload">
        {t("error-boundary-reload", "Reload")}
      </Button>
    </Box>
  );
};

const ErrorBoundaryComponent: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
};

export default ErrorBoundaryComponent;
