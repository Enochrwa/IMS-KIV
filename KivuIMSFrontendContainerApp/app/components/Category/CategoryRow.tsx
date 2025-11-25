import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Box,
  Typography,
  Table,
  TableBody,
  Collapse,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Category, CategoryNode } from "./types/categoryTypes";

const CategoryRow: React.FC<{
  category: CategoryNode;
  level?: number;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}> = ({ category, level = 0, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <TableRow hover>
        {/* Category Info */}
        <TableCell>
          <Box display="flex" alignItems="center" sx={{ pl: level * 2 }}>
            {hasChildren && (
              <IconButton
                size="small"
                onClick={() => setOpen(!open)}
                sx={{ mr: 1 }}
              >
                {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
              </IconButton>
            )}
            <Box>
              <Typography fontWeight={500}>{category.name}</Typography>
              {!matchMD && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 12, pt: 1 }}
                >
                  <b>Path</b>: {category.path || "-"} &nbsp;•&nbsp;{" "}
                  <b>Depth:</b> {category.depth} &nbsp;•&nbsp; <b>Status:</b>{" "}
                  {category.status}
                </Typography>
              )}
            </Box>
          </Box>
        </TableCell>

        {/* Action Menu */}
        <TableCell align="center">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Fade in={showActions}>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                  position: "absolute",
                  right: matchMD ? 70 : 115,
                  background: "white",
                  borderRadius: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  px: 1,
                  py: 0.5,
                  top: matchMD ? -5 : -5,
                  transition: "all 0.3s ease",
                  zIndex: 232324343
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    onEdit(category);
                    setShowActions(!showActions);
                  }}
                >
                  <EditOutlinedIcon color="primary" fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    onDelete(category);
                    setShowActions(!showActions);
                  }}
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <VisibilityOutlinedIcon
                    fontSize="small"
                    onClick={() => {
                      setShowActions(!showActions);
                    }}
                  />
                </IconButton>
              </Box>
            </Fade>

            <IconButton
              size="small"
              onClick={() => setShowActions(!showActions)}
              sx={{
                background: showActions
                  ? theme.palette.grey[300]
                  : theme.palette.grey[100],
                transition: "all 0.2s ease",
                "&:hover": { backgroundColor: theme.palette.grey[300] }
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {/* Recursive children */}
      {hasChildren && (
        <TableRow>
          <TableCell colSpan={3} sx={{ p: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small">
                <TableBody>
                  {category.children!.map((child) => (
                    <CategoryRow
                      key={child.id}
                      category={child}
                      level={level + 1}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default CategoryRow;
