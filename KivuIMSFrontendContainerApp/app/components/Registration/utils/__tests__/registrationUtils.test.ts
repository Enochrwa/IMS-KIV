import {
  hasStoreInfo,
  transformRegistrationToRequest
} from "../registrationUtils";
import { RegistrationData, StoreInfo } from "../../types/registrationTypes";
import { RegisterRequest } from "../../../../Graphql/types/register";

describe("registrationUtils", () => {
  // ------------------------------
  // ✅ hasStoreInfo
  // ------------------------------
  describe("hasStoreInfo", () => {
    it("should return true when all store fields are non-empty", () => {
      const store: StoreInfo = {
        name: "Main Store",
        address: {
          province: "Kigali City",
          district: "Gasabo",
          sector: "Remera",
          cell: "Kisimenti",
          village: "Nyarutarama",
          streetAddress: "KG 123 St",
          country: "Rwanda"
        }
      };
      expect(hasStoreInfo(store)).toBe(true);
    });

    it("should return false when some fields are empty", () => {
      const store: StoreInfo = {
        name: "",
        address: {
          province: "",
          district: "",
          sector: "",
          cell: "",
          village: "",
          streetAddress: "",
          country: "Rwanda"
        }
      };
      expect(hasStoreInfo(store)).toBe(false);
    });

    it("should return false when fields are null or undefined", () => {
      const store = {
        name: null,
        address: {
          province: undefined,
          district: "Gasabo",
          sector: null,
          cell: undefined,
          village: null,
          streetAddress: ""
        }
      };
      // @ts-expect-error - intentionally testing invalid shape
      expect(hasStoreInfo(store)).toBe(false);
    });
  });

  // ------------------------------
  // ✅ transformRegistrationToRequest
  // ------------------------------
  describe("transformRegistrationToRequest", () => {
    const mockData: RegistrationData = {
      admin: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+250789123456",
        password: "password123",
        profileImage: "https://example.com/photo.jpg",
        phoneCountryCode: "+250"
      },
      company: {
        name: "Kivunova Ltd",
        businessType: "Tech",
        currencyCode: "RWF",
        registrationNumber: "REG123456",
        description: "Software company",
        address: {
          province: "Kigali City",
          district: "Gasabo",
          sector: "Remera",
          cell: "Kisimenti",
          village: "Nyarutarama",
          streetAddress: "KG 123 St",
          country: "Rwanda"
        }
      },
      store: {
        name: "Kivunova Store",
        address: {
          province: "Kigali City",
          district: "Gasabo",
          sector: "Remera",
          cell: "Kisimenti",
          village: "Nyarutarama",
          streetAddress: "KG 123 St",
          country: "Rwanda"
        }
      }
    };

    it("should correctly map RegistrationData to RegisterRequest", () => {
      const result = transformRegistrationToRequest(mockData);

      const expected: RegisterRequest = {
        admin: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+250789123456",
          password: "password123",
          profileImage: "https://example.com/photo.jpg"
        },
        company: {
          name: "Kivunova Ltd",
          businessType: "Tech",
          currencyCode: "RWF",
          registrationNumber: "REG123456",
          description: "Software company",
          address: {
            province: "Kigali City",
            district: "Gasabo",
            sector: "Remera",
            cell: "Kisimenti",
            village: "Nyarutarama",
            streetAddress: "KG 123 St",
            country: "Rwanda"
          }
        },
        store: {
          name: "Kivunova Store",
          address: {
            province: "Kigali City",
            district: "Gasabo",
            sector: "Remera",
            cell: "Kisimenti",
            village: "Nyarutarama",
            streetAddress: "KG 123 St",
            country: "Rwanda"
          }
        }
      };

      expect(result).toEqual(expected);
    });

    it("should omit phoneCountryCode from result", () => {
      const result = transformRegistrationToRequest(mockData);

      expect(result.admin).not.toHaveProperty("phoneCountryCode");
    });

    it("should handle missing optional fields gracefully", () => {
      const minimalData: RegistrationData = {
        admin: {
          firstName: "A",
          lastName: "B",
          email: "a@b.com",
          phone: "+250788888888",
          password: "pw",
          profileImage: "",
          phoneCountryCode: "+250"
        },
        company: {
          name: "Test",
          businessType: "",
          currencyCode: "",
          registrationNumber: "",
          description: "",
          address: {
            province: "",
            district: "",
            sector: "",
            cell: "",
            village: "",
            streetAddress: "",
            country: ""
          }
        },
        store: {
          name: "",
          address: {
            province: "",
            district: "",
            sector: "",
            cell: "",
            village: "",
            streetAddress: "",
            country: ""
          }
        }
      };

      const result = transformRegistrationToRequest(minimalData);
      expect(result.admin.firstName).toBe("A");
      expect(result.company.address.streetAddress).toBe("");
      expect(result.store.address.province).toBe("");
    });
  });
});
