package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ListStoresUsersResponse {
    private String code;
    private List<User> users;

    public ListStoresUsersResponse() {
    }

    public ListStoresUsersResponse(String code) {
        this.code = code;
    }
}
