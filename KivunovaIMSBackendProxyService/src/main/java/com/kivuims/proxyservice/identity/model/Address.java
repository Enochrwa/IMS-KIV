package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Address {
    private String country;
    private String province;
    private String district;
    private String sector;
    private String cell;
    private String village;
    private String streetAddress;
}
