package com.kivuims.proxyservice.identity.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterError {
    private String code;

    public RegisterError() {}

    public RegisterError(String code) {
        this.code = code;
    }
}
