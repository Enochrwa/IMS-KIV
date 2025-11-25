import React, { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import ProfileCard from "./ProfileCard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ImsLogo } from "../../assets";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SideBarMenuItems from "./constants/SidebarConfig";
import {
  KivuI18nContext,
  localizedPath,
  useKivunovaTranslation
} from "@kivunova/kivufrontendcommon";
import { PAGE_PORTAL_DASHBOARD } from "../../PageRoutes";

const drawerWidth = 260;

interface SideBarProps {
  setFlyOver?: (open: boolean) => void;
}

const Sidebar: React.FC<SideBarProps> = ({ setFlyOver }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const handleToggle = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const { t } = useKivunovaTranslation();
  const { language, defaultLang } = useContext(KivuI18nContext);

  const isSelected = (path: string): boolean => {
    const isDashboard =
      path == `/${PAGE_PORTAL_DASHBOARD}` ||
      path == `/${language}/${PAGE_PORTAL_DASHBOARD}`;

    if (isDashboard) {
      return true;
    }

    return location.pathname.includes(path) && !isDashboard;
  };

  const handleClickItem = (path?: string) => {
    if (path) {
      navigate(localizedPath(path, language, defaultLang));
      setFlyOver?.(false);
    }
  };

  return (
    <Drawer
      variant="permanent"
      data-testid="sidebar-drawer"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#6f49c9",
          color: "#fff",
          borderRight: "none"
        }
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src={ImsLogo} sx={{ bgcolor: "white" }} />
        <Typography variant="body1" fontWeight={600}>
          {t("welcome-back", "Welcome back")}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Main Menu */}
      <List>
        {SideBarMenuItems.map((item) => {
          const hasChildren =
            Array.isArray(item.items) && item.items.length > 0;
          const open = openMenus[item.label] || false;

          return (
            <React.Fragment key={item.label}>
              <ListItemButton
                onClick={() =>
                  hasChildren
                    ? handleToggle(item.label)
                    : handleClickItem(item.path)
                }
                component={!hasChildren ? Link : "button"}
                to={
                  !hasChildren
                    ? localizedPath(item.path, language, defaultLang)
                    : undefined
                }
                selected={isSelected(item.path)}
                sx={{
                  color: "#fff",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255,255,255,0.15)"
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.25)"
                  },
                  width: "100%"
                }}
              >
                <ListItemIcon sx={{ color: "#fff", fontSize: 12 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 13 }}
                />
                {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>

              {/* Nested Items */}
              {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item?.items?.map((subItem) => (
                      <ListItemButton
                        key={subItem.label}
                        component={Link}
                        to={localizedPath(subItem.path, language, defaultLang)}
                        selected={isSelected(subItem.path)}
                        sx={{
                          pl: 6,
                          color: "#fff",
                          "&.Mui-selected": {
                            backgroundColor: "rgba(255,255,255,0.15)"
                          },
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.25)"
                          }
                        }}
                      >
                        <ListItemIcon sx={{ color: "#fff", minWidth: 28 }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.label}
                          primaryTypographyProps={{ fontSize: 13 }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      <ProfileCard />
    </Drawer>
  );
};

export default Sidebar;
