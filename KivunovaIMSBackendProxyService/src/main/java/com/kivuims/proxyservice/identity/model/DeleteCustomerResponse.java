package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeleteCustomerResponse {
    private String code;

    public DeleteCustomerResponse() {
    }

    public DeleteCustomerResponse(String code) {
        this.code = code;
    }
}
