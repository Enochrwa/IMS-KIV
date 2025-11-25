import { SxProps } from "@mui/system";

export const linkButtonSx: SxProps = {
  background: "none",
  border: "none",
  cursor: "pointer",
  font: "inherit",
  color: "#6941C6",
  textDecoration: "underline",
  "&:hover": {
    color: "#5b36b0"
  }
};

export const footerBoxSx: SxProps = {
  position: "absolute",
  bottom: 16,
  right: 0,
  display: { xs: "flex", sm: "flex", md: "none" },
  justifyContent: "center",
  width: "100%",
  px: 2,
  mt: { xs: 16, sm: 4 }
};
