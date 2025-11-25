import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, useTheme, Typography } from "@mui/material";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { useDispatch } from "react-redux";
import ProfileSkeleton from "./ProfileSkeleton";
import { useGetProfile } from "../../hooks/api/useProfile";
import { setProfileData } from "../../store/slices/profileSlice";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";
import { ProfileTabsConfig } from "./constants/ProfileTabConfig";
import useMediaQuery from "@mui/material/useMediaQuery";

const UserProfile = () => {
  const { t } = useKivunovaTranslation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));

  const getProfileMutation = useGetProfile();
  const isPending = getProfileMutation.isPending;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await getProfileMutation.mutateAsync();
        if (result?.getProfile)
          dispatch(setProfileData(result.getProfile.user));
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    loadProfile();
  }, [dispatch]);

  if (isPending) return <ProfileSkeleton />;

  return (
    <Box sx={{ p: matchMD ? 0 : 4 }}>
      {/* Tabs Header */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            textTransform: "none" // 👈 Prevent uppercase
          },
          "& .MuiTabs-indicator": { backgroundColor: BRAND_COLOR }
        }}
        aria-label={t("profile-tabs-aria", "Profile tabs")}
      >
        {ProfileTabsConfig.map(
          ({ id, labelKey, defaultLabel, ariaControls }) => (
            <Tab
              key={id}
              label={
                <Typography variant="body1">
                  {t(labelKey, defaultLabel)}
                </Typography>
              }
              id={`profile-tab-${id}`}
              aria-controls={ariaControls}
              sx={{
                textTransform: "none",
                color: "black",
                "&.Mui-selected": { color: BRAND_COLOR },
                "&:hover": { color: BRAND_HOVER }
              }}
            />
          )
        )}
      </Tabs>

      {/* Tab Panels */}
      {ProfileTabsConfig.map(
        ({ id, content }) =>
          tab === id && (
            <Box
              key={id}
              id={`profile-tabpanel-${id}`}
              role="tabpanel"
              aria-labelledby={`profile-tab-${id}`}
              sx={{ mt: 2 }}
            >
              {content}
            </Box>
          )
      )}
    </Box>
  );
};

export default UserProfile;
