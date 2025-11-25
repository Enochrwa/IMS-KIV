import { AccountStatus, UserRole } from "../../Profile/enums/profileEnums";
import { Employee } from "../types/employees";

export const sampleProfiles: Employee[] = [
  {
    id: "USR001",
    firstName: "Divine",
    lastName: "Uwase",
    email: "divine.uwase@kivunova.com",
    phone: "+250788123456",
    profileImage: "https://kivunova.com/uploads/profiles/divine.jpg",
    role: UserRole.WAREHOUSE_MANAGER,
    accountStatus: AccountStatus.ACTIVE
  },
  {
    id: "USR002",
    firstName: "Eric",
    lastName: "Mugabo",
    email: "eric.mugabo@kivunova.com",
    phone: "+250788654321",
    profileImage: "https://kivunova.com/uploads/profiles/eric.jpg",
    role: UserRole.ANALYST,
    accountStatus: AccountStatus.ACTIVE
  },
  {
    id: "USR003",
    firstName: "Alice",
    lastName: "Niyonsaba",
    email: "alice.niyonsaba@kivunova.com",
    phone: "+250781234567",
    profileImage: "https://kivunova.com/uploads/profiles/alice.jpg",
    role: UserRole.ANALYST,
    accountStatus: AccountStatus.ACTIVE
  },
  {
    id: "USR004",
    firstName: "David",
    lastName: "Nsengimana",
    email: "david.nsengimana@kivunova.com",
    phone: "+250789987654",
    profileImage: "https://kivunova.com/uploads/profiles/david.jpg",
    role: UserRole.ANALYST,
    accountStatus: AccountStatus.ACTIVE
  },
  {
    id: "USR005",
    firstName: "Ines",
    lastName: "Mukamana",
    email: "ines.mukamana@kivunova.com",
    phone: "+250785432198",
    profileImage: "https://kivunova.com/uploads/profiles/ines.jpg",
    role: UserRole.ANALYST,
    accountStatus: AccountStatus.SUSPENDED
  }
];
