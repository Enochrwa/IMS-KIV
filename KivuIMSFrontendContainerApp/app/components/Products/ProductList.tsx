import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Paper,
  Button,
  TextField,
  Stack,
  Pagination,
  Checkbox,
  TableSortLabel,
  useTheme
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useGetProductList } from "../../hooks/api/useProduct";
import NoProductListFound from "./NoProductListFound";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import { Product } from "./types/products";
import AddProductModal from "./AddProductModal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PAGE_PORTAL_INVENTORY_PRODUCT, PORTAL_PREFIX } from "../../PageRoutes";
import MetricLedger from "../common/MetricLedger/MetricLedger";
import { getMetricPeriodLabel } from "../Dashboard/utils/metricsUtils";
import { useDashboardData } from "../../hooks/api/useDashboardData";
import DashboardHeader from "../Dashboard/DashboardHeader";
import { setMetricTimeRange } from "../../store/slices/dashboardSlice";

type Order = "asc" | "desc";

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList } = useSelector((state: RootState) => state.products);
  const [openAddModal, setOpenAddModal] = useState(false);
  const useGetProductListMutation = useGetProductList();
  const theme = useTheme();
  const { productKpis } = useDashboardData();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));
  const metricTimeRange = useSelector(
    (state: RootState) => state.dashboard
  ).metricTimeRange;

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Product>("name");

  useEffect(() => {
    (async () => {
      try {
        await useGetProductListMutation.mutateAsync();
      } catch {
        console.error("Failed to fetch product list");
      }
    })();
  }, []);

  /** ✅ Filter by search */
  const filteredList = useMemo(() => {
    if (!search.trim()) return productList;
    return productList.filter((product) =>
      Object.values(product)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [productList, search]);

  /** ✅ Sorting logic */
  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      const aValue = a[orderBy] ?? "";
      const bValue = b[orderBy] ?? "";
      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      return order === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredList, order, orderBy]);

  /** ✅ Handle selection */
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(sortedList.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  /** ✅ Handle sort toggle */
  const handleSort = (property: keyof Product) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (!productList.length) {
    return <NoProductListFound />;
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 110px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "100%",
        padding: 0,
        color: "black",
        mt: 1
      }}
    >
      <Box gap={4} flexDirection="column" display="flex">
        {!matchMD && (
          <Box>
            <DashboardHeader
              onRangeChange={(r) => dispatch(setMetricTimeRange(r))}
              showRangeSelectorOnly
            />
            <MetricLedger
              kpis={productKpis}
              period={getMetricPeriodLabel(
                metricTimeRange.startDate,
                metricTimeRange.endDate
              )}
            />
          </Box>
        )}
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
            textAlign="center"
            color="textPrimary"
          >
            Products List
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexDirection={matchMD ? "column" : "row"}
          >
            <TextField
              size="small"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Box display="flex" flexDirection="row" gap={2}>
              <Button
                variant="contained"
                onClick={() => setOpenAddModal(true)}
                sx={{
                  backgroundColor: BRAND_COLOR,
                  "&:hover": { backgroundColor: BRAND_HOVER, opacity: 0.8 },
                  textTransform: "none"
                }}
              >
                Add New Product
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
            </Box>
          </Box>
        </Box>

        {/* Table Section */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={
                      selectedIds.length === sortedList.length &&
                      sortedList.length > 0
                    }
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < sortedList.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>

                {/* Conditional columns */}
                {matchMD
                  ? [
                      { id: "name", label: "Product Name" },
                      { id: "minimumStockThreshold", label: "Quantity" }
                    ].map((column) => (
                      <TableCell
                        key={column.id}
                        sortDirection={orderBy === column.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
                          onClick={() => handleSort(column.id as keyof Product)}
                          sx={{ fontSize: 13, fontWeight: 600 }}
                        >
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    ))
                  : [
                      { id: "name", label: "Product Name" },
                      { id: "supplierId", label: "Supplier" },
                      { id: "productCategory", label: "Category" },
                      { id: "minSalesPrice", label: "Price" },
                      { id: "minimumStockThreshold", label: "Stock Level" },
                      { id: "maximumStockThreshold", label: "Rec. Level" }
                    ].map((column) => (
                      <TableCell
                        key={column.id}
                        sortDirection={orderBy === column.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
                          onClick={() => handleSort(column.id as keyof Product)}
                          sx={{ fontSize: 13, fontWeight: 600 }}
                        >
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}

                <TableCell
                  sx={{ fontSize: 13, fontWeight: 600 }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedList.map((product) => (
                <TableRow
                  key={product.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                      cursor: "pointer"
                    }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                    />
                  </TableCell>

                  {/* Common product name column */}
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {!matchMD && (
                        <Avatar
                          src={
                            product.brandName
                              ? `/images/products/${product.brandName}.png`
                              : undefined
                          }
                          sx={{ width: 30, height: 30 }}
                        />
                      )}
                      <Typography variant="body2" sx={{ fontSize: 13 }}>
                        {product.name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Conditional content */}
                  {matchMD ? (
                    <>
                      <TableCell sx={{ fontSize: 13 }}>
                        {product.minimumStockThreshold ?? "-"}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={{ fontSize: 13 }}>
                        {product.supplierId ?? "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {product.productCategory ?? "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {product.minSalesPrice
                          ? `$${product.minSalesPrice.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {product.minimumStockThreshold ?? "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {product.maximumStockThreshold ?? "-"}
                      </TableCell>
                    </>
                  )}

                  <TableCell align="center" sx={{ fontSize: 13 }}>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(
                          `/${PORTAL_PREFIX}/${PAGE_PORTAL_INVENTORY_PRODUCT}/${product.id}`
                        )
                      }
                    >
                      <VisibilityOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Product Modal */}
        <AddProductModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          variant="outlined"
          count={Math.ceil(sortedList.length / 10)}
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default ProductList;
