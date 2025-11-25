package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdminResendVerificationResponse {
    private String code;

    public AdminResendVerificationResponse() {
    }

    public AdminResendVerificationResponse(String code) {
        this.code = code;
    }
}
