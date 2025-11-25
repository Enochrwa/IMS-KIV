import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
  KivuI18nContext,
  localizedPath,
  useKivunovaTranslation
} from "@kivunova/kivufrontendcommon";

import { PAGE_ROUTE_LOGIN } from "../../PageRoutes";
import { RegistrationStepConfig } from "./constants/registrationConstants";
import { RegistrationData } from "./types/registrationTypes";
import { BRAND_COLOR, BRAND_HOVER } from "../common/constants/colors";
import AdminInfoForm from "./AdminInfoForm";
import CompanyInfoForm from "./CompanyInfoForm";
import StoreInfoForm from "./StoreInfoForm";
import ReviewAndSubmit from "./ReviewAndSubmit";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setFormData } from "../../store/slices/registrationSlice";
import AuthSidePanel from "../common/AuthSidePanel/AuthSidePanel";
import { linkButtonSx } from "../common/buttonStyles";
import RenderRegistrationIcon from "./RenderRegistrationIcon";
import {
  getRegistrationAdminSchema,
  getRegistrationCompanySchema,
  getRegistrationStoreSchema,
  hasStoreInfo,
  transformRegistrationToRequest
} from "./utils/registrationUtils";
import useCreateAccount from "../../hooks/api/useCreateAccount";
import AuthRightSidePanel from "../common/AuthSidePanel/AuthRightSidePanel";

const Registration: React.FC = () => {
  const dispatch = useAppDispatch();
  const useCreateAccountMutation = useCreateAccount();
  const originalFormData = useAppSelector(
    (state) => state.registration.registrationFormData
  );
  const { t } = useKivunovaTranslation();
  const navigate = useNavigate();
  const { language, defaultLang } = useContext(KivuI18nContext) || {};
  const [activeStep, setActiveStep] = useState(0);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const cloneDeep = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));
  const formData = {
    admin: cloneDeep(originalFormData.admin),
    company: cloneDeep(originalFormData.company),
    store: cloneDeep(originalFormData.store)
  };

  const adminSchema = useMemo(() => {
    return getRegistrationAdminSchema(t);
  }, []);

  const companySchema = useMemo(() => {
    return getRegistrationCompanySchema(t);
  }, []);

  const storeSchema = useMemo(() => {
    return getRegistrationStoreSchema(t);
  }, []);

  const schemaList = [adminSchema, companySchema, storeSchema];
  const currentSchema = schemaList[activeStep] || adminSchema;
  const currentStepConfig = RegistrationStepConfig[activeStep];

  const isLoading = useCreateAccountMutation.isPending;

  const renderStep = (): ReactNode => {
    switch (activeStep) {
      case 1:
        return (
          <CompanyInfoForm
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 2:
        return (
          <StoreInfoForm
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 3:
        return <ReviewAndSubmit allData={formData} />;

      default:
        return <AdminInfoForm control={control} errors={errors} />;
    }
  };

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset
  } = useForm<RegistrationData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(currentSchema as any),
    defaultValues: {
      admin: cloneDeep(formData.admin),
      company: cloneDeep(formData.company),
      store: cloneDeep(formData.store)
    },
    mode: "onChange"
  });

  const handleNext = async () => {
    const valid = await trigger();
    if (valid) {
      dispatch(setFormData({ ...formData, ...getValues() }));
      if (activeStep === 1 && !hasStoreInfo(formData.store)) {
        setShowAddressDialog(true);
      } else {
        setActiveStep((p) => p + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((p) => p - 1);
  };

  const onSubmit = async (data: RegistrationData) => {
    const request = transformRegistrationToRequest(data);

    try {
      await useCreateAccountMutation.mutateAsync(request, {
        onSuccess: () => {
          navigate(localizedPath(PAGE_ROUTE_LOGIN, language, defaultLang));
        }
      });
    } catch (e) {
      console.error("something went wrong", e);
    }
  };

  useEffect(() => {
    // When user moves between steps, rehydrate RHF with a mutable copy
    reset(cloneDeep(originalFormData));
  }, [activeStep, originalFormData]);

  return (
    <Box sx={{ display: "flex", height: "auto", background: "white" }}>
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "none", lg: "flex", xl: "flex" },
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <AuthSidePanel />
      </Box>

      <AuthRightSidePanel>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 3, sm: 4, lg: 6 },
            position: "relative"
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mb: 4, // Increased bottom margin
              pb: 2 // Added padding bottom
            }}
          >
            {t("register", "Register")}
          </Typography>

          <Stepper
            activeStep={activeStep}
            sx={{ width: "100%", maxWidth: 600 }}
          >
            {RegistrationStepConfig.map((step, index) => (
              <Step key={step.titleTranslationKey}>
                <StepLabel
                  icon={
                    <RenderRegistrationIcon
                      index={index}
                      activeStep={activeStep}
                    />
                  }
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", md: "flex" },
                      color: index <= activeStep ? BRAND_COLOR : "inherit"
                    }}
                  >
                    {t(step.titleTranslationKey, step.title)}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Dialog
            open={showAddressDialog}
            onClose={() => setShowAddressDialog(false)}
            data-testid="registration-address-dialog"
            sx={{ padding: "10px" }}
          >
            <DialogTitle
              data-testid="registration-address-dialog-title"
              textAlign="center"
            >
              {t("confirm-store-address", "Confirm Store Details")}
            </DialogTitle>
            <DialogContent>
              <Typography
                data-testid="registration-address-dialog-description"
                variant="body2"
              >
                {t(
                  "confirm-store-address-description",
                  "Is the store information the same as the company information? If yes, we will use the company info for the store and skip the store information collection."
                )}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                data-testid="registration-address-dialog-no"
                onClick={() => {
                  // Clear store location fields when user wants different address
                  setValue("store.name", "");
                  setValue("store.address.province", "");
                  setValue("store.address.district", "");
                  setValue("store.address.sector", "");
                  setValue("store.address.cell", "");
                  setValue("store.address.village", "");
                  setShowAddressDialog(false);
                  setActiveStep(2);
                }}
              >
                {t("no", "No")}
              </Button>
              <Button
                data-testid="registration-address-dialog-yes"
                variant="contained"
                onClick={() => {
                  const companyValues = getValues().company;
                  setValue("store.name", companyValues.name);
                  setValue(
                    "store.address.province",
                    companyValues?.address?.province
                  );
                  setValue(
                    "store.address.district",
                    companyValues?.address?.district
                  );
                  setValue(
                    "store.address.sector",
                    companyValues?.address?.sector
                  );
                  setValue("store.address.cell", companyValues?.address?.cell);
                  setValue(
                    "store.address.village",
                    companyValues?.address?.village
                  );
                  setValue(
                    "store.address.streetAddress",
                    companyValues?.address?.streetAddress
                  );
                  dispatch(setFormData({ ...formData, ...getValues() }));
                  setShowAddressDialog(false);
                  setActiveStep(3);
                }}
              >
                {t("yes", "Yes")}
              </Button>
            </DialogActions>
          </Dialog>

          <Box
            sx={{
              mt: 2,
              width: "100%",
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              overflowY: "auto"
            }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              data-testid="registration-form"
            >
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{
                  mb: 3,
                  width: "100%"
                }}
              >
                {t(
                  currentStepConfig.labelTranslationKey,
                  currentStepConfig.labelText
                )}
              </Typography>
              {renderStep()}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mt: 4,
                  gap: 2
                }}
              >
                {/* Stepper buttons container */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                  }}
                >
                  {activeStep > 0 && (
                    <Button
                      onClick={handleBack}
                      sx={{ color: BRAND_COLOR, flex: 1 }}
                      data-testid="registration-back"
                    >
                      {t("back", "Back")}
                    </Button>
                  )}

                  <>
                    {activeStep < RegistrationStepConfig.length - 1 ? (
                      <Button
                        variant="contained"
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          await handleNext();
                        }}
                        sx={{
                          backgroundColor: BRAND_COLOR,
                          flex: 1,
                          "&:hover": {
                            backgroundColor: BRAND_HOVER,
                            opacity: 0.8
                          }
                        }}
                        data-testid="registration-next"
                      >
                        {t("next", "Next")}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        type="submit"
                        loading={isLoading}
                        loadingPosition="end"
                        data-testid="registration-submit"
                        sx={{
                          backgroundColor: BRAND_COLOR,
                          flex: 1,
                          "&:hover": {
                            backgroundColor: BRAND_HOVER,
                            opacity: 0.8
                          }
                        }}
                      >
                        <Typography variant="body2">
                          {isLoading
                            ? t("processing", "processing...")
                            : t("submit", "Submit")}
                        </Typography>
                      </Button>
                    )}
                  </>
                </Box>

                {/* Login link container */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography variant="body2" data-testid="login-signup-text">
                    {t("have-account-login", "Already have an account?")}&nbsp;
                    <Link
                      component="button"
                      type="button"
                      underline="hover"
                      sx={linkButtonSx}
                      onClick={() =>
                        navigate(
                          localizedPath(PAGE_ROUTE_LOGIN, language, defaultLang)
                        )
                      }
                      data-testid="registration-to-login"
                    >
                      {t("registration.login-link-text", "Login")}
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </form>
          </Box>
          {/* Small-screen footer: right-aligned on xs/sm, hidden on md+ */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 0,
              display: { xs: "flex", sm: "flex", md: "none" },
              justifyContent: "center",
              width: "100%",
              px: 2,
              mt: { xs: 16, sm: 4 }
            }}
          >
            <Typography
              variant="caption"
              sx={{ textAlign: "center", width: "100%" }}
              data-testid="login-left-footer"
            >
              © kivunova 2025
            </Typography>
          </Box>
        </Paper>
      </AuthRightSidePanel>
    </Box>
  );
};

export default Registration;
