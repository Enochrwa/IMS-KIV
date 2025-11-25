import React from "react";
import ProfileView from "../ProfileView";
import PasswordChangeForm from "../PasswordChangeForm";
import { ProfileTabConfig } from "../types/profileTypes";

export const ProfileTabsConfig: ProfileTabConfig[] = [
  {
    id: 0,
    labelKey: "profile-tab",
    defaultLabel: "Profile",
    ariaControls: "profile-tabpanel-0",
    content: <ProfileView />
  },
  {
    id: 1,
    labelKey: "change-password-tab",
    defaultLabel: "Password",
    ariaControls: "profile-tabpanel-2",
    content: <PasswordChangeForm />
  }
];
