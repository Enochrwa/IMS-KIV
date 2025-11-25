package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Customer {
    private String id;
    private String companyId;
    private String name;
    private String type; // INDIVIDUAL or COMPANY
    private String phone;
    private String email;
    private String tin;
    private Address address;

    public Customer() {
    }
}
