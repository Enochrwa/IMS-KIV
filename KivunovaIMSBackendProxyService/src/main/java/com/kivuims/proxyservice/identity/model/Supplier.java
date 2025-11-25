package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Supplier {
    private String id;
    private String name;
    private String email;
    private String phone;
    private Address address;
    private String status; // ACTIVE, SUSPENDED, DELETED

    public Supplier() {
    }
}
