package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChangePasswordResponse {
    private String code;

    public ChangePasswordResponse() {}

    public ChangePasswordResponse(String code) {
        this.code = code;
    }
}
