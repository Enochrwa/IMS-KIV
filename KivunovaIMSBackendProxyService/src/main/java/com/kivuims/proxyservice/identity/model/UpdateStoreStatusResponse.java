package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateStoreStatusResponse {
    private String code;
    private String storeId;
    private String status;

    public UpdateStoreStatusResponse() {
    }

    public UpdateStoreStatusResponse(String code) {
        this.code = code;
    }
}
