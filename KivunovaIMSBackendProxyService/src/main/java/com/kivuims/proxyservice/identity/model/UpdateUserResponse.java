package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateUserResponse {
    private String code;
    private User user;

    public UpdateUserResponse() {
    }

    public UpdateUserResponse(String code) {
        this.code = code;
    }
}
