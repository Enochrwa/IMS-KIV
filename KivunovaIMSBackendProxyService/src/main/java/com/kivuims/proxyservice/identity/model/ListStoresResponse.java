package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ListStoresResponse {
    private String code;
    private List<Store> stores;

    public ListStoresResponse() {
    }

    public ListStoresResponse(String code) {
        this.code = code;
    }
}
