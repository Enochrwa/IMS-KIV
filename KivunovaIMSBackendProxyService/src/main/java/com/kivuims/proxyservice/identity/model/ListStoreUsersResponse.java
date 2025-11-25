package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ListStoreUsersResponse {
    private String code;
    private List<User> users;

    public ListStoreUsersResponse() {
    }

    public ListStoreUsersResponse(String code) {
        this.code = code;
    }
}
