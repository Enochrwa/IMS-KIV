package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeleteUserResponse {
    private String code;

    public DeleteUserResponse() {
    }

    public DeleteUserResponse(String code) {
        this.code = code;
    }
}
