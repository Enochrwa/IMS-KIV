package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class LogoutResponse {
    private String code;

    public LogoutResponse() {
    }

    public LogoutResponse(String code) {
        this.code = code;
    }
}
