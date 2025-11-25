import { AccountStatus, UserRole } from "../../Profile/enums/profileEnums";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  role: UserRole;
  accountStatus: AccountStatus;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  companyId: string;
  storeId: string;
  role: UserRole;
}

export interface CreateEmployeeResponse {
  createUser: {
    code: string;
    employee?: Employee;
  };
}

export interface GetStoreEmployeeListResponse {
  listStoreUsers: {
    code: string;
    users: Employee[];
  };
}

export interface GetCompanyEmployeeListResponse {
  listCompanyUsers: {
    code: string;
    users: Employee[];
  };
}

export interface GetEmployeeDetailResponse {
  getUser: {
    code: string;
    user: Employee;
  };
}

export interface UpdateEmployeeResponse {
  updateUser: {
    code: string;
    user: Employee;
  };
}

export interface GetEmployeeDetailRequest {
  employeeId: string;
}

export interface GetCompanyEmployeeListRequest {
  companyId: string;
}

export interface GetStoreEmployeeListRequest {
  companyId: string;
}

export interface UpdateEmployeeRequest {
  userId: string;
  updates: EmployeeFormData;
}
