import React from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";

const ProfileSkeleton: React.FC = () => {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        p: { xs: 2, sm: 3 }
      }}
      data-testid="profile-skeleton"
      aria-busy="true"
      role="progressbar"
    >
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Title */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          <Skeleton width={180} height={28} />
        </Typography>

        {/* Avatar + Name Section */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          sx={{ mb: 4, flexWrap: "wrap" }}
        >
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            animation="wave"
          />
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Skeleton width="40%" height={28} animation="wave" sx={{ mb: 1 }} />
            <Skeleton width="60%" height={24} animation="wave" />
          </Box>
        </Stack>

        {/* Role Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <Skeleton width={80} height={20} animation="wave" />
          </Typography>
          <Typography variant="body1">
            <Skeleton width={120} height={24} animation="wave" />
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Info Grid (mirrors ProfileView) */}
        <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Box key={index}>
              <Skeleton
                width={100}
                height={20}
                sx={{ mb: 1 }}
                animation="wave"
              />
              <Skeleton width={180} height={24} animation="wave" />
            </Box>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileSkeleton;
