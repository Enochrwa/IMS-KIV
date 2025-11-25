package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResetPasswordResponse {
    private String code;

    public ResetPasswordResponse() {}

    public ResetPasswordResponse(String code) {
        this.code = code;
    }
}
