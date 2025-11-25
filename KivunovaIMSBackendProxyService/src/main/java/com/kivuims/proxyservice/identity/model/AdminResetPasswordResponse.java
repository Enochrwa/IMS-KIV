package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdminResetPasswordResponse {
    private String code;

    public AdminResetPasswordResponse() {
    }

    public AdminResetPasswordResponse(String code) {
        this.code = code;
    }
}
