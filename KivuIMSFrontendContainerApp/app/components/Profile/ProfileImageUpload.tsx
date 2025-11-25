import React from "react";
import { Box, Button, Avatar, LinearProgress } from "@mui/material";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";

interface ProfileImageUploadProps {
  profileImage: string | undefined;
  uploadProgress: number;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  t: (key: string, defaultValue: string) => string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  profileImage,
  uploadProgress,
  onImageChange,
  isDisabled = false,
  t
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <Avatar
        src={profileImage || undefined}
        alt="Profile"
        sx={{ width: 80, height: 80 }}
        data-testid="profile-avatar"
      />
      <Box>
        <Button
          variant="outlined"
          component="label"
          data-testid="upload-button"
          disabled={isDisabled || uploadProgress > 0}
          sx={{
            borderColor: BRAND_COLOR,
            color: BRAND_COLOR,
            "&:hover": {
              borderColor: BRAND_HOVER,
              backgroundColor: `${BRAND_COLOR}10`
            }
          }}
        >
          {t("upload-profile-image", "Upload Profile Image")}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={onImageChange}
            data-testid="file-input"
            disabled={isDisabled || uploadProgress > 0}
          />
        </Button>
        {uploadProgress > 0 && (
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ mt: 1, width: 200 }}
            data-testid="upload-progress"
          />
        )}
      </Box>
    </Box>
  );
};

export default ProfileImageUpload;
