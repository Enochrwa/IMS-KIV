package com.kivuims.proxyservice.identity.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginInput {
    private String email;
    private String password;
}
