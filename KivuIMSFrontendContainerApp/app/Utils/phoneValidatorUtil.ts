import {
  type CountryCode,
  parsePhoneNumberWithError,
  PhoneNumber
} from "libphonenumber-js";

export const parsePhoneNumber = (
  phoneNumberString: string,
  country: CountryCode
): PhoneNumber | undefined => {
  try {
    const phoneNumber = parsePhoneNumberWithError(phoneNumberString, {
      defaultCountry: country,
      // Demand that the entire input string must be a phone number.
      // Otherwise, it would "extract" a phone number from an input string.
      extract: false
    });
    return phoneNumber;
  } catch {
    return undefined;
  }
};

export const isValidPhoneNumberForCountry = (
  phoneNumberString: string,
  country: CountryCode
): boolean => {
  const phoneNumber = parsePhoneNumber(phoneNumberString, country);
  if (!phoneNumber) {
    return false;
  }
  if (phoneNumber.country !== country) {
    return false;
  }
  return phoneNumber.isValid();
};
