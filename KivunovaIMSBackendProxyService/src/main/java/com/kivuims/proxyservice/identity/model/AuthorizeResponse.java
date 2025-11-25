package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AuthorizeResponse {
    private String code;
    private boolean authorized;
    private String userId;
    private String role;
    private String companyId;
    private String storeId;
    private String accessToken; // if refreshed
    private String refreshToken; // if refreshed

    public AuthorizeResponse() {
    }

    public AuthorizeResponse(String code, boolean authorized) {
        this.code = code;
        this.authorized = authorized;
    }

    public AuthorizeResponse(String code, boolean authorized, String userId, String role, String companyId,
            String storeId) {
        this.code = code;
        this.authorized = authorized;
        this.userId = userId;
        this.role = role;
        this.companyId = companyId;
        this.storeId = storeId;
    }

    public AuthorizeResponse(String code, boolean authorized, String userId, String role, String companyId,
            String storeId, String accessToken, String refreshToken) {
        this.code = code;
        this.authorized = authorized;
        this.userId = userId;
        this.role = role;
        this.companyId = companyId;
        this.storeId = storeId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
