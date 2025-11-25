import { ALERT_BANNER_CODE } from "../Enums/alertCode";

export const AlertBannerCodeMap: Record<
  ALERT_BANNER_CODE,
  { translationKey: string; value: string }
> = {
  [ALERT_BANNER_CODE.INTERNAL_SERVER_ERROR]: {
    translationKey: "internal-server-error-text",
    value: "Something went wrong, please try again."
  },
  [ALERT_BANNER_CODE.FAIL_TO_SEND_EMAIL]: {
    translationKey: "fail-to-send-email-text",
    value:
      "We are unable to send OTP code. Please verify your email and try again or refresh the browser."
  },
  [ALERT_BANNER_CODE.ACCESS_DENIED]: {
    translationKey: "access-denied-text",
    value:
      "Access denied. Please log in and try again, or verify that you have the necessary permissions to access this resource."
  },
  [ALERT_BANNER_CODE.FAILED_TO_UPLOAD_FILE_TO_S3]: {
    translationKey: "failed-to-upload-file-text",
    value:
      "Something went wrong while uploading your file, please refresh the browser and try again."
  },
  [ALERT_BANNER_CODE.INVALID_OR_UNPOSTED_JOB]: {
    translationKey: "invalid-or-unposted-job-text",
    value:
      "This job does not exist or it's unposted. Please try a different job."
  },
  [ALERT_BANNER_CODE.INVALID_OTP]: {
    translationKey: "invalid-otp-text",
    value:
      "OTP provided is invalid. Please check your email or resend OTP again."
  },
  [ALERT_BANNER_CODE.MEMBER_NOT_FOUND]: {
    translationKey: "member-not-found-text",
    value:
      "Email doesn't exist, please register or sign in with a different email."
  },
  [ALERT_BANNER_CODE.NOT_FOUND]: {
    translationKey: "not-found-text",
    value:
      "The requested resource was not found or the input is invalid. Please refresh your browser and try again."
  },
  [ALERT_BANNER_CODE.INTERNAL_ERROR]: {
    translationKey: "internal-error-text",
    value: "Something went wrong, please try again."
  },
  [ALERT_BANNER_CODE.INVALID_CREDENTIALS]: {
    translationKey: "invalid-credentials-text",
    value:
      "Invalid email or password. Please check your credentials and try again."
  },
  [ALERT_BANNER_CODE.DUPLICATE_KEYS]: {
    translationKey: "duplicate-keys-text",
    value:
      "One or more fields are already existing. Please verify and try again."
  },
  [ALERT_BANNER_CODE.DUPLICATE_PASSWORD]: {
    translationKey: "duplicate-password-text",
    value: "Please use a new password. Old and new password are similar."
  },
  [ALERT_BANNER_CODE.RESEND_OTP_SUCCESS]: {
    translationKey: "resend-otp-success-text",
    value: "OTP resent successfully."
  },
  [ALERT_BANNER_CODE.REGISTRATION_SUCCESS]: {
    translationKey: "registration-success-text",
    value: "Your account has been created successfully."
  },
  [ALERT_BANNER_CODE.ACCOUNT_NOT_ACTIVE]: {
    translationKey: "login-inactive-account-error-text",
    value:
      "Your account is inactive. Please check your email or contact your admin to activate it."
  },
  [ALERT_BANNER_CODE.PROFILE_UPDATED]: {
    translationKey: "profile-updated-success-message",
    value: "Profile updated successfully."
  },
  [ALERT_BANNER_CODE.PROFILE_IMAGE_UPLOAD_SUCCESS]: {
    translationKey: "profile-image-uploaded-success-message",
    value: "Profile image uploaded successfully."
  },
  [ALERT_BANNER_CODE.PROFILE_IMAGE_SIZE_ERROR]: {
    translationKey: "profile-image-size-error-message",
    value: "Profile image is too big. Please choose a small sized image"
  },
  [ALERT_BANNER_CODE.PROFILE_IMAGE_TYPE_ERROR]: {
    translationKey: "profile-image-type-error-message",
    value: "Invalid type used, please upload a valid image"
  }
};
