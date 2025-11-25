import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  useTheme,
  Stack,
  useMediaQuery
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useGetCategoryList } from "../../hooks/api/useCategory";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import NoCategoryFound from "./NoCategoryFound";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { Category } from "./types/categoryTypes";
import { buildCategoryTree } from "./utils/categoryUtils";
import CategoryRow from "./CategoryRow";
import DashboardHeader from "../Dashboard/DashboardHeader";
import { setMetricTimeRange } from "../../store/slices/dashboardSlice";
import MetricLedger from "../common/MetricLedger/MetricLedger";
import { getMetricPeriodLabel } from "../Dashboard/utils/metricsUtils";
import { useDashboardData } from "../../hooks/api/useDashboardData";

type Order = "asc" | "desc";

const CategoryList: React.FC = () => {
  const dispatch = useDispatch();
  const { categoryList } = useSelector((state: RootState) => state.categories);
  const getCategoryListMutation = useGetCategoryList();
  const { categoryKpis } = useDashboardData();

  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));
  const metricTimeRange = useSelector(
    (state: RootState) => state.dashboard.metricTimeRange
  );

  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Category>("name");

  useEffect(() => {
    (async () => {
      await getCategoryListMutation.mutateAsync();
    })();
  }, []);

  /** ✅ Search */
  const filteredList = useMemo(() => {
    if (!search.trim()) return categoryList;
    return categoryList.filter((c) =>
      Object.values(c).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [categoryList, search]);

  /** ✅ Sorting */
  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      const aValue = a[orderBy] ?? "";
      const bValue = b[orderBy] ?? "";
      return order === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredList, order, orderBy]);

  /** ✅ Build hierarchy */
  const categoryTree = useMemo(
    () => buildCategoryTree(sortedList),
    [sortedList]
  );

  const handleSort = (property: keyof Category) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (!categoryList.length) {
    return (
      <>
        <NoCategoryFound onAddClick={() => setOpenAddModal(true)} />
        <AddCategoryModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
      </>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 110px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        color: "black",
        mt: 1
      }}
    >
      <Box gap={4} flexDirection="column" display="flex">
        {/* KPI Header Section */}
        {!matchMD && (
          <Box>
            <DashboardHeader
              onRangeChange={(r) => dispatch(setMetricTimeRange(r))}
              showRangeSelectorOnly
            />
            <MetricLedger
              kpis={categoryKpis}
              period={getMetricPeriodLabel(
                metricTimeRange.startDate,
                metricTimeRange.endDate
              )}
            />
          </Box>
        )}

        {/* Toolbar Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          gap={2}
          flexDirection={matchMD ? "column" : "row"}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign={matchMD ? "center" : "left"}
            color="textPrimary"
          >
            Category List
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexDirection={matchMD ? "column" : "row"}
          >
            <TextField
              size="small"
              placeholder="Search categories"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth={matchMD}
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => setOpenAddModal(true)}
                sx={{
                  backgroundColor: BRAND_COLOR,
                  "&:hover": { backgroundColor: BRAND_HOVER, opacity: 0.8 },
                  textTransform: "none"
                }}
              >
                Add New Category
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: BRAND_COLOR,
                  color: BRAND_COLOR,
                  "&:hover": { backgroundColor: BRAND_HOVER, color: "white" },
                  textTransform: "none"
                }}
              >
                Export
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Table Section */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[{ id: "name", label: "Category Name" }].map((col) => (
                  <TableCell key={col.id}>
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id as keyof Category)}
                      sx={{ fontSize: 13, fontWeight: 600 }}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}

                <TableCell
                  align="center"
                  sx={{ fontSize: 13, fontWeight: 600 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categoryTree.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  onEdit={(cat) => {
                    setSelectedCategory(cat);
                    setOpenEditModal(true);
                  }}
                  onDelete={(cat) => {
                    setSelectedCategory(cat);
                    setOpenDeleteModal(true);
                  }}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modals */}
      <AddCategoryModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
      {selectedCategory && (
        <>
          <EditCategoryModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            category={selectedCategory}
          />
          <DeleteCategoryModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            category={selectedCategory}
          />
        </>
      )}
    </Box>
  );
};

export default CategoryList;
