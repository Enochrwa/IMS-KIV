package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequestVerificationOtpResponse {
    private String code;

    public RequestVerificationOtpResponse() {
    }

    public RequestVerificationOtpResponse(String code) {
        this.code = code;
    }
}
