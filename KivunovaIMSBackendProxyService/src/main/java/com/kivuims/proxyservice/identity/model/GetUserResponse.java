package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class GetUserResponse {
    private String code;
    private User user;

    public GetUserResponse() {
    }

    public GetUserResponse(String code) {
        this.code = code;
    }
}
