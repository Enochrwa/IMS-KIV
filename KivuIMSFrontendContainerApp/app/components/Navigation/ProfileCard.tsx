import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  KivuI18nContext,
  localizedPath,
  useKivunovaTranslation
} from "@kivunova/kivufrontendcommon";
import { PAGE_PORTAL_PROFILE } from "../../PageRoutes";
import { useGetProfile } from "../../hooks/api/useProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Skeleton
} from "@mui/material";
import { Logout } from "@mui/icons-material";

const ProfileCard: React.FC = () => {
  const navigate = useNavigate();
  const { language, defaultLang } = useContext(KivuI18nContext);
  const profileLink = localizedPath(
    `${PAGE_PORTAL_PROFILE}`,
    language,
    defaultLang
  );
  const { profileData } = useSelector((state: RootState) => state.profile);
  const getProfileMutation = useGetProfile();

  const { t } = useKivunovaTranslation();

  useEffect(() => {
    (async () => {
      await getProfileMutation.mutateAsync();
    })();
  }, []);

  const handleNavigate = () => {
    navigate(profileLink);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(profileLink);
    }
  };

  const handleLogout = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Add logout handler here
  };

  return (
    <Box
      component="article"
      role="article"
      aria-label="Profile Card"
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        justifyContent: "space-between"
      }}
    >
      <Box
        onClick={handleNavigate}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="View profile details"
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          textDecoration: "none",
          color: "inherit",
          cursor: "pointer",
          "&:focus": {
            outline: "2px solid"
          }
        }}
      >
        {getProfileMutation.status === "pending" ? (
          <Skeleton variant="circular" width={40} height={40} />
        ) : (
          <Avatar
            src={profileData?.profileImage}
            alt={profileData?.firstName}
          />
        )}
        <Box>
          <Typography variant="subtitle1">
            {profileData?.firstName || t("user-name", "Username")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profileData?.role || t("profile-role", "Role")}
          </Typography>
        </Box>
      </Box>
      <Tooltip title={t("logout", "Logout")}>
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="primary"
          sx={{ minWidth: 0, p: 1, borderRadius: "50%" }}
        >
          <Logout />
        </Button>
      </Tooltip>
    </Box>
  );
};

export default ProfileCard;
