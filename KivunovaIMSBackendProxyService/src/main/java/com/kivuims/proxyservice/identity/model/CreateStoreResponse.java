package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateStoreResponse {
    private String code;
    private Store store;

    public CreateStoreResponse() {
    }

    public CreateStoreResponse(String code) {
        this.code = code;
    }
}
