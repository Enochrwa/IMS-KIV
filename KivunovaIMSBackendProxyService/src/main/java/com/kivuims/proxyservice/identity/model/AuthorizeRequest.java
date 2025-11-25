package com.kivuims.proxyservice.identity.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthorizeRequest {
    private String accessToken;
    private String refreshToken;
}
