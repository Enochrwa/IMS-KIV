package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterResponse {
    private String code;
    private String companyId;
    private String userId;
    private String companyStatus;
    private String adminStatus;
    private String storeId;
    private String storeStatus;

    public RegisterResponse() {}

    public RegisterResponse(String code) {
        this.code = code;
    }

    public RegisterResponse(String code, String companyId, String userId, String companyStatus,
                           String adminStatus, String storeId, String storeStatus) {
        this.code = code;
        this.companyId = companyId;
        this.userId = userId;
        this.companyStatus = companyStatus;
        this.adminStatus = adminStatus;
        this.storeId = storeId;
        this.storeStatus = storeStatus;
    }

    public boolean isSuccess() {
        return "REGISTERED".equals(code) || "SUCCESS".equals(code);
    }
}
