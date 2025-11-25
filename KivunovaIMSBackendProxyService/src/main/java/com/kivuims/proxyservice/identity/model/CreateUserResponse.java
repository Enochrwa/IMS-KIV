package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateUserResponse {
    private String code;
    private User user;

    public CreateUserResponse() {
    }

    public CreateUserResponse(String code) {
        this.code = code;
    }
}
