package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateCustomerResponse {
    private String code;
    private Customer customer;

    public CreateCustomerResponse() {
    }

    public CreateCustomerResponse(String code) {
        this.code = code;
    }
}
