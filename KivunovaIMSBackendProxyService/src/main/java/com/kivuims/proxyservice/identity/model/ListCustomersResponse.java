package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ListCustomersResponse {
    private String code;
    private List<Customer> customers;

    public ListCustomersResponse() {
    }

    public ListCustomersResponse(String code) {
        this.code = code;
    }
}
