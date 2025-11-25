package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Company {
    private String id;
    private String name;
    private String registrationNumber;
    private String businessType;
    private String currencyCode;
    private Address address;
    private String description;
    private String status; // PENDING, ACTIVE, SUSPENDED, DELETED

    public Company() {
    }
}
