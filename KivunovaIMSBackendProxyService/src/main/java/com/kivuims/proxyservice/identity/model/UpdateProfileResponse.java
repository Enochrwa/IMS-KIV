package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateProfileResponse {
    private String code;
    private User user;

    public UpdateProfileResponse() {
    }

    public UpdateProfileResponse(String code) {
        this.code = code;
    }
}
