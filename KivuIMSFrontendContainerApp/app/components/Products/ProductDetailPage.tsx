import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { useParams } from "react-router-dom";
import { useGetProductDetail } from "../../hooks/api/useProduct";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import NoProductDetailFound from "./NoProductDetailFound";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";

const ProductDetailPage: React.FC = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { productId } = useParams<{ productId: string }>();
  const product = useSelector(
    (state: RootState) => state.products.productDetail
  );
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));
  const getProductDetailMutation = useGetProductDetail();

  useEffect(() => {
    (async () => {
      try {
        if (productId) {
          await getProductDetailMutation.mutateAsync({ productId });
        }
      } catch {
        console.error("Failed to fetch product details");
      }
    })();
  }, [productId]);

  if (!product) {
    return <NoProductDetailFound />;
  }

  const fields: [string, string | undefined | number][] = [
    ["Name", product.name],
    ["Category", product.productCategory],
    ["Subcategory", product.productSubcategory],
    ["Subcategory Item", product.productSubcategoryItem],
    ["Supplier ID", product.supplierId],
    ["Brand Name", product.brandName],
    ["Barcode", product.barcode],
    ["Lot Number", product.lotNumber],
    ["Min Stock Threshold", product.minimumStockThreshold],
    ["Max Stock Threshold", product.maximumStockThreshold],
    ["Lead Time (days)", product.leadTime],
    ["Daily Consumption", product.dailyConsumption],
    ["Min Sales Price", product.minSalesPrice],
    ["Purchase Price", product.purchasePrice],
    ["Material", product.material],
    ["Weight (lbs)", product.weight],
    ["Packaging Type", product.packagingType],
    ["Height", product.height],
    ["Width", product.width],
    ["Color", product.color],
    ["Thickness", product.thickness],
    ["Pack Size", product.packSize],
    ["Production Date", product.productionDate],
    ["Expiration Date", product.expirationDate],
    ["Description", product.description]
  ];

  return (
    <Box sx={{ color: "black" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={matchMD ? "column" : "row"}
        alignItems="center"
        mb={3}
        flexWrap="wrap"
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign={matchMD ? "center" : "left"}
        >
          {product.name}
        </Typography>

        <Box
          display="flex"
          justifyContent={matchMD ? "center" : "flex-end"}
          alignItems="center"
          width={matchMD ? "100%" : "auto"}
          gap={2}
          mt={{ xs: 2, md: 0 }}
        >
          <Button
            variant="text"
            startIcon={<EditOutlinedIcon />}
            onClick={() => setOpenEdit(true)}
            sx={{
              backgroundColor: "white",
              color: BRAND_COLOR,
              "&:hover": {
                backgroundColor: BRAND_HOVER,
                opacity: 0.8,
                color: "white"
              },
              textTransform: "none"
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={() => setOpenDelete(true)}
            sx={{
              textTransform: "none"
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Detail Card */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 2,
          overflow: "hidden"
        }}
      >
        <Grid container>
          {fields.map(([label, value], index) => (
            <React.Fragment key={label}>
              <Grid
                sx={{
                  width: "100%",
                  padding: "0 10px",
                  display: "flex",
                  borderBottom:
                    index === fields.length - 1 ? "none" : "1px solid #e0e0e0"
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    borderRight: "0.5px solid #e0e0e0",
                    p: 1.5,
                    bgcolor: "white"
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    {label}:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 2,
                    p: 1.5,
                    bgcolor: "white"
                  }}
                >
                  <Typography variant="body2">{value ?? "-"}</Typography>
                </Box>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>

      {/* Modals */}
      <EditProductModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        product={product}
      />
      <DeleteProductModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        product={product}
      />
    </Box>
  );
};

export default ProductDetailPage;
