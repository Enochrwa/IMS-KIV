package com.kivuims.proxyservice.identity.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kivuims.proxyservice.identity.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;
import java.util.HashMap;
import java.util.Map;

@Controller
public class AuthController {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public AuthController(WebClient.Builder webClientBuilder, @Value("${identity.base-url}") String identityBaseUrl) {
        this.webClient = webClientBuilder.baseUrl(identityBaseUrl).build();
    }

    private String getBearerTokenForForwarding(String authHeader) {
        if (authHeader == null || authHeader.trim().isEmpty()) {
            return null;
        }
        if (authHeader.trim().startsWith("Bearer ")) {
            return authHeader.trim();
        }
        return "Bearer " + authHeader.trim();
    }

    private <T> Mono<T> forwardResponseAsIs(String json, Class<T> responseClass) {
        try {
            Map<String, Object> responseMap = objectMapper.readValue(json,
                    new TypeReference<Map<String, Object>>() {
                    });
            T response = objectMapper.convertValue(responseMap, responseClass);
            return Mono.just(response);
        } catch (Exception e) {
            try {
                T response = objectMapper.readValue(json, responseClass);
                return Mono.just(response);
            } catch (Exception e2) {
                return Mono.error(e2);
            }
        }
    }
    @MutationMapping
    public Mono<LoginResponse> login(@Argument LoginInput input) {
        Map<String, String> body = new HashMap<>();
        body.put("email", input.getEmail());
        body.put("password", input.getPassword());

        return webClient.post()
                .uri("/auth/login")
                .bodyValue(body)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, LoginResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(
                                objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}", LoginResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<LogoutResponse> logout(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {
        String bearerToken = getBearerTokenForForwarding(authHeader);
        WebClient.RequestBodySpec requestSpec = webClient.post()
                .uri("/auth/logout");

        if (bearerToken != null) {
            requestSpec = requestSpec.header("Authorization", bearerToken);
        }

        return requestSpec
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, LogoutResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(
                                objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}", LogoutResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<ForgotPasswordResponse> forgotPassword(@Argument("input") Map<String, Object> input) {
        return webClient.post()
                .uri("/auth/password/forgot")
                .bodyValue(input)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, ForgotPasswordResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                ForgotPasswordResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<ResetPasswordResponse> resetPassword(@Argument("input") Map<String, Object> input) {
        return webClient.post()
                .uri("/auth/password/reset")
                .bodyValue(input)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, ResetPasswordResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                ResetPasswordResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<ChangePasswordResponse> changePassword(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {
        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new ChangePasswordResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = new HashMap<>(input);
        requestBody.remove("accessToken");

        return webClient.post()
                .uri("/auth/password/change")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, ChangePasswordResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                ChangePasswordResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<AuthorizeResponse> authorize(
            @Argument("input") AuthorizeRequest input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {
        Map<String, String> body = new HashMap<>();
        body.put("accessToken", input.getAccessToken());
        body.put("refreshToken", input.getRefreshToken());

        String bearerToken = getBearerTokenForForwarding(authHeader);
        WebClient.RequestBodySpec requestSpec = webClient.post()
                .uri("/auth/authorize");

        if (bearerToken != null) {
            requestSpec = requestSpec.header("Authorization", bearerToken);
        }

        return requestSpec
                .bodyValue(body)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, AuthorizeResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue(
                                "{\"code\":\"SERVICE_UNAVAILABLE\",\"authorized\":false}", AuthorizeResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<RequestVerificationOtpResponse> requestVerificationOtp(@Argument("input") Map<String, Object> input) {
        return webClient.post()
                .uri("/auth/request-verification-otp")
                .bodyValue(input)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, RequestVerificationOtpResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                RequestVerificationOtpResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<VerifyEmailOtpResponse> verifyEmailOtp(@Argument("input") Map<String, Object> input) {
        return webClient.post()
                .uri("/auth/verify-email-otp")
                .bodyValue(input)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, VerifyEmailOtpResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                VerifyEmailOtpResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }
}
