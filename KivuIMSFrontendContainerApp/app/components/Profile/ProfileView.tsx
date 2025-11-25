import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Modal,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useKivunovaTranslation } from "@kivunova/kivufrontendcommon";
import ProfileEditForm from "./ProfileEditForm";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { EditOutlined, LogoutOutlined } from "@mui/icons-material";

const ProfileView: React.FC = () => {
  const { t } = useKivunovaTranslation();
  const { profileData } = useSelector((state: RootState) => state.profile);
  const [openEditModal, setOpenEditModal] = useState(false);

  if (!profileData) return null;

  // Format phone
  const phoneDisplay = profileData.phone ? `${profileData.phone}` : "N/A";

  const renderField = (label: string, value?: string | number | null) => (
    <Box
      sx={{ display: "flex", flexDirection: "column", mb: 2, flex: "1 1 45%" }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {t(label, label.replace(/-/g, " "))}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: value ? "text.primary" : "text.disabled",
          fontWeight: 500
        }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              mb: 3
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={profileData.profileImage || undefined}
                alt={t("profile-avatar-alt", "User profile image")}
                sx={{ width: 70, height: 70, border: "2px solid #e0e0e0" }}
              />
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ wordBreak: "break-word" }}
                >
                  {`${profileData.firstName ?? ""} ${profileData.lastName ?? ""}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData.role ||
                    t("profile-role-placeholder", "No role assigned")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenEditModal(true)}
                color="error"
                startIcon={<LogoutOutlined />}
                sx={{
                  mt: { xs: 2, sm: 0 },
                  textTransform: "none",
                  borderRadius: 2
                }}
                aria-label={t("logout-button-aria", "Logout")}
              >
                {t("edit-profile", "Logout")}
              </Button>

              <Button
                variant="contained"
                onClick={() => setOpenEditModal(true)}
                startIcon={<EditOutlined />}
                sx={{
                  mt: { xs: 2, sm: 0 },
                  textTransform: "none",
                  borderRadius: 2,
                  backgroundColor: BRAND_COLOR,
                  "&:hover": { backgroundColor: BRAND_HOVER }
                }}
                aria-label={t("edit-profile-button-aria", "Edit Profile")}
              >
                {t("edit-profile", "Edit Profile")}
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Info Section */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mb: 2 }}
            color="text.primary"
          >
            {t("profile-information-title", "Profile Information")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "flex-start"
            }}
          >
            {renderField("first-name", profileData.firstName)}
            {renderField("last-name", profileData.lastName)}
            {renderField("email", profileData.email)}
            {renderField("phone", phoneDisplay)}
            {renderField("account-status", profileData.accountStatus)}
          </Box>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-profile-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            width: { xs: "90%", sm: 500 },
            p: 3,
            outline: "none"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}
          >
            <Typography
              id="edit-profile-modal-title"
              variant="h6"
              fontWeight={600}
            >
              {t("edit-profile-title", "Edit Profile")}
            </Typography>
            <IconButton
              onClick={() => setOpenEditModal(false)}
              size="small"
              aria-label={t("close-modal", "Close")}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <ProfileEditForm onClose={() => setOpenEditModal(false)} />
        </Box>
      </Modal>
    </>
  );
};

export default ProfileView;
