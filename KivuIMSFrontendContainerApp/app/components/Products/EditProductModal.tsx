import React from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  IconButton,
  Button,
  useTheme
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useCreateProduct } from "../../hooks/api/useProduct";
import { Product, ProductFormData } from "./types/products";
import { DefaultProductFormValues } from "./constants/products";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import useMediaQuery from "@mui/material/useMediaQuery";

const productSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  productCategory: Yup.string().required("Category is required"),
  supplierId: Yup.string().required("Supplier ID is required"),
  storeId: Yup.string().required("Store ID is required"),
  companyId: Yup.string().required("Company ID is required"),
  productSubcategory: Yup.string().optional(),
  productSubcategoryItem: Yup.string().optional(),
  minimumStockThreshold: Yup.number().typeError("Must be a number").optional(),
  maximumStockThreshold: Yup.number().typeError("Must be a number").optional(),
  leadTime: Yup.number().typeError("Must be a number").optional(),
  dailyConsumption: Yup.number().typeError("Must be a number").optional(),
  minSalesPrice: Yup.number().typeError("Must be a number").optional(),
  purchasePrice: Yup.number().typeError("Must be a number").optional(),
  material: Yup.string().optional(),
  weight: Yup.number().typeError("Must be a number").optional(),
  packagingType: Yup.string().optional(),
  height: Yup.number().typeError("Must be a number").optional(),
  width: Yup.number().typeError("Must be a number").optional(),
  color: Yup.string().optional(),
  thickness: Yup.number().typeError("Must be a number").optional(),
  packSize: Yup.string().optional(),
  description: Yup.string().optional(),
  expirationDate: Yup.string().optional(),
  productionDate: Yup.string().optional(),
  brandName: Yup.string().optional(),
  barcode: Yup.string().optional(),
  lotNumber: Yup.string().optional()
}) as Yup.ObjectSchema<ProductFormData>;

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  product
}) => {
  const createProduct = useCreateProduct();
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    mode: "onChange",
    defaultValues: product
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      await createProduct.mutateAsync(data);
      reset(DefaultProductFormValues);
      onClose();
    } catch (err) {
      console.error("❌ Failed to create product:", err);
    }
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    width: matchMD ? "90%" : "60%",
    maxWidth: 900,
    p: 5,
    maxHeight: "90vh",
    overflowY: "auto"
  };

  /**
   * ✅ Smarter renderField:
   * - fullWidth automatically
   * - numeric detection
   * - multiline for description
   */
  const renderField = (
    name: keyof ProductFormData,
    label: string,
    placeholder?: string
  ) => {
    const isDescription = name === "description";
    const isNumeric = [
      "minimumStockThreshold",
      "maximumStockThreshold",
      "leadTime",
      "dailyConsumption",
      "minSalesPrice",
      "purchasePrice",
      "weight",
      "height",
      "width",
      "thickness"
    ].includes(name);

    return (
      <Box sx={{ width: "80%", margin: "auto" }}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label={label}
              placeholder={placeholder}
              type={isNumeric ? "number" : "text"}
              multiline={isDescription}
              rows={isDescription ? 3 : 1}
              error={!!errors[name]}
              helperText={errors[name]?.message}
            />
          )}
        />
      </Box>
    );
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ paddingTop: 0 }}>
      <Box sx={modalStyle}>
        {/* Header Actions */}
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box mb={3}>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            color="textPrimary"
          >
            Update Product
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {/* Fields */}
          {renderField("name", "Product Name", "Ex: BoomHigh")}
          {renderField("productCategory", "Category", "Ex: Vapes")}
          {renderField("productSubcategory", "Subcategory")}
          {renderField("productSubcategoryItem", "Subcategory Item")}
          {renderField("supplierId", "Supplier ID", "Ex: SUP-001")}
          {renderField("weight", "Weight (lbs)", "2.5")}
          {renderField("minSalesPrice", "Min Sales Price", "120")}
          {renderField("purchasePrice", "Purchase Price", "100")}
          {renderField("minimumStockThreshold", "Min Stock Threshold", "100")}
          {renderField("maximumStockThreshold", "Max Stock Threshold", "2000")}
          {renderField("leadTime", "Lead Time (days)", "5")}
          {renderField("dailyConsumption", "Daily Consumption", "50")}
          {renderField("material", "Material", "Plastic / Steel")}
          {renderField("packagingType", "Packaging Type", "Box / Bag")}
          {renderField("height", "Height", "10")}
          {renderField("width", "Width", "5")}
          {renderField("color", "Color", "Blue")}
          {renderField("thickness", "Thickness", "2")}
          {renderField("packSize", "Pack Size", "10 pcs")}
          {renderField("productionDate", "Production Date", "YYYY-MM-DD")}
          {renderField("expirationDate", "Expiration Date", "YYYY-MM-DD")}
          {renderField("brandName", "Brand Name", "KivuNova")}
          {renderField("barcode", "Barcode", "1234567890")}
          {renderField("lotNumber", "Lot Number", "LOT-001")}
          {renderField(
            "description",
            "Description",
            "Type something about this product..."
          )}

          {/* Footer Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mt: 6,
              width: "80%",
              margin: "auto"
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={createProduct.isPending}
              sx={{
                flex: 1,
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: BRAND_COLOR,
                "&:hover": { backgroundColor: BRAND_HOVER }
              }}
            >
              Add Product
            </LoadingButton>

            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              disabled={createProduct.isPending}
              sx={{
                flex: 1,
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "white",
                color: BRAND_COLOR,
                border: `1px solid ${BRAND_COLOR}`,
                "&:hover": { backgroundColor: BRAND_HOVER, color: "white" }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
