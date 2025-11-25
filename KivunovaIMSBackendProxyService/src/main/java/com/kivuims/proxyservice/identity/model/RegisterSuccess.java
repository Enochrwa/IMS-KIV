package com.kivuims.proxyservice.identity.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterSuccess {
    private String code;
    private String companyId;
    private String userId;
    private String companyStatus;
    private String adminStatus;
    private String storeId;
    private String storeStatus;

    public RegisterSuccess() {
    }

    public RegisterSuccess(String code, String companyId, String userId, String companyStatus,
            String adminStatus, String storeId, String storeStatus) {
        this.code = code;
        this.companyId = companyId;
        this.userId = userId;
        this.companyStatus = companyStatus;
        this.adminStatus = adminStatus;
        this.storeId = storeId;
        this.storeStatus = storeStatus;
    }
}
