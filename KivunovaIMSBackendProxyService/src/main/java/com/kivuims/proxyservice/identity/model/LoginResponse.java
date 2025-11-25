package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginResponse {
    private String code;
    private String accessToken;
    private String refreshToken;
    private Boolean emailVerified;
    private Boolean passwordChangeRequired;

    public LoginResponse() {
    }

    public LoginResponse(String code) {
        this.code = code;
    }

    public LoginResponse(String code, String accessToken, String refreshToken, Boolean emailVerified,
            Boolean passwordChangeRequired) {
        this.code = code;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.emailVerified = emailVerified;
        this.passwordChangeRequired = passwordChangeRequired;
    }
}
