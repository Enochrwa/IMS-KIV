import React, { useContext } from "react";
import { Box, InputAdornment, MenuItem, Select } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import {
  getCurrentLocale,
  KivuI18nContext,
  LOCALE,
  SUPPORTED_LOCALE
} from "@kivunova/kivufrontendcommon";
import { LANGUAGE_MAP } from "./constants/languageSelector";
import { useNavigate } from "react-router";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, defaultLang } =
    useContext(KivuI18nContext) || {};
  const currentLocale = getCurrentLocale(defaultLang);
  const navigate = useNavigate();

  const handleUpdateUrl = (newLang: string) => {
    const path = location.pathname;

    // remove existing lang prefix if any
    const parts = path.split("/").filter(Boolean);
    const first = parts[0];
    const hasLangPrefix = SUPPORTED_LOCALE.includes(first as LOCALE);
    const restPath = hasLangPrefix ? parts.slice(1).join("/") : parts.join("/");

    // add new prefix only if not default
    const newPath =
      newLang === defaultLang ? `/${restPath}` : `/${newLang}/${restPath}`;

    navigate(newPath === "//" ? "/" : newPath, { replace: true });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minWidth: "120px",
        zIndex: 10000000
      }}
    >
      <Select
        value={language}
        onChange={(e) => {
          const newLang = e.target.value as string;
          setLanguage(newLang as LOCALE);
          handleUpdateUrl(newLang);
        }}
        variant="outlined"
        size="small"
        sx={{
          fontSize: "small",
          bgcolor: "background.paper",
          "& .MuiSelect-select": { display: "flex", alignItems: "center" },
          "& .MuiOutlinedInput-notchedOutline": { border: "none" }
        }}
        startAdornment={
          <InputAdornment position="start">
            <PublicIcon fontSize="small" sx={{ color: "#a78bfa" }} />
          </InputAdornment>
        }
      >
        {Object.entries(LANGUAGE_MAP)
          .filter(([code]) => SUPPORTED_LOCALE.includes(code as LOCALE))
          .map(([code, label]) => (
            <MenuItem
              style={{ fontSize: "small" }}
              key={code}
              value={code}
              selected={code === currentLocale}
            >
              {label}
            </MenuItem>
          ))}
      </Select>
    </Box>
  );
};

export default LanguageSelector;
