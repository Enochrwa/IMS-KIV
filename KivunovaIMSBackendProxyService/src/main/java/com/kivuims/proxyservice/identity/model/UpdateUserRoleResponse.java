package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateUserRoleResponse {
    private String code;
    private User user;

    public UpdateUserRoleResponse() {
    }

    public UpdateUserRoleResponse(String code) {
        this.code = code;
    }
}
