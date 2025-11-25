package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class VerifyEmailOtpResponse {
    private String code;

    public VerifyEmailOtpResponse() {
    }

    public VerifyEmailOtpResponse(String code) {
        this.code = code;
    }
}
