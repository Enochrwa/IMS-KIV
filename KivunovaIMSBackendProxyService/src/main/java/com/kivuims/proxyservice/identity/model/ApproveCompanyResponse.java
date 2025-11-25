package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApproveCompanyResponse {
    private String code;
    private Company company;

    public ApproveCompanyResponse() {
    }

    public ApproveCompanyResponse(String code) {
        this.code = code;
    }
}
