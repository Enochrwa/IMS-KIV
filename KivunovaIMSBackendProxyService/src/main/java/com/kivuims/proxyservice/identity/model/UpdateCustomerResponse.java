package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateCustomerResponse {
    private String code;
    private Customer customer;

    public UpdateCustomerResponse() {
    }

    public UpdateCustomerResponse(String code) {
        this.code = code;
    }
}
