package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ForgotPasswordResponse {
    private String code;

    public ForgotPasswordResponse() {
    }

    public ForgotPasswordResponse(String code) {
        this.code = code;
    }
}
