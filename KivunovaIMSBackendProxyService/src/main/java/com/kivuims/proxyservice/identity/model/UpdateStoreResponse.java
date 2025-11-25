package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateStoreResponse {
    private String code;
    private Store store;

    public UpdateStoreResponse() {
    }

    public UpdateStoreResponse(String code) {
        this.code = code;
    }
}
