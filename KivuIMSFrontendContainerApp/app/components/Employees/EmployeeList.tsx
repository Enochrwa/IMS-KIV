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
  useTheme,
  MenuItem
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import NoEmployeeListFound from "./NoEmployeeListFound";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import AddEmployeeModal from "./AddEmployeeModal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PAGE_PORTAL_PEOPLE_EMPLOYEES, PORTAL_PREFIX } from "../../PageRoutes";
import MetricLedger from "../common/MetricLedger/MetricLedger";
import { getMetricPeriodLabel } from "../Dashboard/utils/metricsUtils";
import { useDashboardData } from "../../hooks/api/useDashboardData";
import DashboardHeader from "../Dashboard/DashboardHeader";
import { setMetricTimeRange } from "../../store/slices/dashboardSlice";
import { Employee } from "./types/employees";

type Order = "asc" | "desc";

const EmployeeList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employeeList = useSelector(
    (state: RootState) => state.employees.employeeList
  );
  const [openAddModal, setOpenAddModal] = useState(false);
  // const useGetCompanyEmployeeListMutation = useGetCompanyEmployeeList();
  // const useGetStoreEmployeeListMutation = useGetStoreEmployeeList();
  const theme = useTheme();
  const { employeeKpis } = useDashboardData();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));
  const metricTimeRange = useSelector(
    (state: RootState) => state.dashboard
  ).metricTimeRange;
  const stores = ["All", "Store1", "Store2"];

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Employee>("firstName");
  const [storeFilter, setStoreFilter] = useState(stores[0]);

  useEffect(() => {
    (async () => {
      try {
        // await useGetCompanyEmployeeList().mutateAsync({ companyId: "dsd" });
      } catch {
        console.error("Failed to fetch company list");
      }
    })();
  }, []);

  /** ✅ Filter by search */
  const filteredList = useMemo(() => {
    if (!search.trim()) return employeeList;
    return employeeList.filter((product) =>
      Object.values(product)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [employeeList, search]);

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
  const handleSort = (property: keyof Employee) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (!employeeList.length) {
    return <NoEmployeeListFound />;
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
              kpis={employeeKpis}
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
            Employee List
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexDirection={matchMD ? "column" : "row"}
          >
            {/* 🧩 New store filter */}
            <TextField
              select
              size="small"
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              sx={{ minWidth: 180 }}
              label="Store"
            >
              {stores.map((store) => (
                <MenuItem key={store} value={store}>
                  {store}
                </MenuItem>
              ))}
            </TextField>
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
                Add New Employee
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
                          onClick={() =>
                            handleSort(column.id as keyof Employee)
                          }
                          sx={{ fontSize: 13, fontWeight: 600 }}
                        >
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    ))
                  : [
                      { id: "firstName", label: "Firstname" },
                      { id: "lastName", label: "Lastname" },
                      { id: "email", label: "email" },
                      { id: "phone", label: "Phone" },
                      { id: "role", label: "Role" }
                    ].map((column) => (
                      <TableCell
                        key={column.id}
                        sortDirection={orderBy === column.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
                          onClick={() =>
                            handleSort(column.id as keyof Employee)
                          }
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
              {sortedList.map((employee) => (
                <TableRow
                  key={employee.id}
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
                      checked={selectedIds.includes(employee.id)}
                      onChange={() => handleSelectOne(employee.id)}
                    />
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {!matchMD && (
                        <Avatar
                          src={employee.profileImage}
                          sx={{ width: 30, height: 30 }}
                        />
                      )}
                      <Typography variant="body2" sx={{ fontSize: 13 }}>
                        {employee.firstName}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Conditional content */}
                  <TableCell sx={{ fontSize: 13 }}>
                    {employee.firstName ?? "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    {employee.lastName ?? "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    {employee.email || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    {employee.phone ?? "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    {employee.role ?? "N/A"}
                  </TableCell>

                  <TableCell align="center" sx={{ fontSize: 13 }}>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(
                          `/${PORTAL_PREFIX}/${PAGE_PORTAL_PEOPLE_EMPLOYEES}/${employee.id}`
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
        <AddEmployeeModal
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

export default EmployeeList;
