package com.kivuims.proxyservice.identity.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kivuims.proxyservice.identity.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;
import java.util.HashMap;
import java.util.Map;

@Controller
public class UserController {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public UserController(WebClient.Builder webClientBuilder, @Value("${identity.base-url}") String identityBaseUrl) {
        this.webClient = webClientBuilder.baseUrl(identityBaseUrl).build();
    }

    private Map<String, Object> createErrorResponse(IdentityErrorCode errorCode) {
        Map<String, Object> error = new HashMap<>();
        error.put("code", errorCode.name());
        return error;
    }

    private Mono<Map<String, Object>> handleJsonResponse(String json) {
        try {
            return Mono.just(objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {
            }));
        } catch (Exception e) {
            return Mono.just(createErrorResponse(IdentityErrorCode.PARSING_ERROR));
        }
    }

    private Mono<Map<String, Object>> handleWebClientError(WebClientRequestException ex) {
        return Mono.just(createErrorResponse(IdentityErrorCode.SERVICE_UNAVAILABLE));
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

    private Map<String, Object> createRequestBody(Map<String, Object> input) {
        Map<String, Object> requestBody = new HashMap<>(input);
        requestBody.remove("accessToken");
        return requestBody;
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

    @QueryMapping
    public Mono<GetProfileResponse> getProfile(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new GetProfileResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        return webClient.get()
                .uri("/users/profile")
                .header("Authorization", bearerToken)
                .exchangeToMono(response -> {
                    return response.bodyToMono(String.class)
                            .defaultIfEmpty("{}")
                            .flatMap(body -> {
                                if (response.statusCode().is2xxSuccessful()) {
                                    return forwardResponseAsIs(body, GetProfileResponse.class)
                                            .onErrorResume(ex -> Mono.just(
                                                    new GetProfileResponse(IdentityErrorCode.PARSING_ERROR.name())));
                                } else {
                                    try {
                                        Map<String, Object> errorMap = objectMapper.readValue(body,
                                                new TypeReference<Map<String, Object>>() {
                                                });
                                        String errorCode = errorMap.containsKey("code")
                                                ? errorMap.get("code").toString()
                                                : IdentityErrorCode.UNAUTHORIZED.name();
                                        return Mono.just(new GetProfileResponse(errorCode));
                                    } catch (Exception e) {
                                        return Mono.just(new GetProfileResponse(IdentityErrorCode.UNAUTHORIZED.name()));
                                    }
                                }
                            });
                })
                .onErrorResume(WebClientRequestException.class, ex -> {
                    return Mono.just(new GetProfileResponse(IdentityErrorCode.SERVICE_UNAVAILABLE.name()));
                })
                .onErrorResume(Exception.class, ex -> {
                    return Mono.just(new GetProfileResponse(IdentityErrorCode.UNKNOWN_ERROR.name()));
                });
    }

    @MutationMapping
    public Mono<UpdateProfileResponse> updateProfile(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new UpdateProfileResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.patch()
                .uri("/users/profile")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, UpdateProfileResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                UpdateProfileResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @QueryMapping
    public Mono<GetUserResponse> getUser(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new GetUserResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/admin/get")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, GetUserResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                GetUserResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<DeleteUserResponse> deleteUser(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new DeleteUserResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/admin/delete")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, DeleteUserResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                DeleteUserResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<UpdateUserResponse> updateUser(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new UpdateUserResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.patch()
                .uri("/users/admin/update")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, UpdateUserResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                UpdateUserResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<UpdateUserRoleResponse> updateUserRole(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new UpdateUserRoleResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/admin/role")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, UpdateUserRoleResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                UpdateUserRoleResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<Map<String, Object>> adminChangePassword(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(createErrorResponse(IdentityErrorCode.UNAUTHORIZED));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/password/admin-change")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(this::handleJsonResponse)
                .onErrorResume(WebClientRequestException.class, this::handleWebClientError);
    }

    @QueryMapping
    public Mono<ListCompanyUsersResponse> listCompanyUsers(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new ListCompanyUsersResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/admin/company/list")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, ListCompanyUsersResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                ListCompanyUsersResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @QueryMapping
    public Mono<ListStoreUsersResponse> listStoreUsers(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new ListStoreUsersResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/admin/store/list")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, ListStoreUsersResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                ListStoreUsersResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @QueryMapping
    public Mono<ListStoresUsersResponse> listStoresUsers(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new ListStoresUsersResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/admin/stores/list")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, ListStoresUsersResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                ListStoresUsersResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<AdminResetPasswordResponse> adminResetPassword(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new AdminResetPasswordResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/admin/password/reset")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, AdminResetPasswordResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                AdminResetPasswordResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<AdminResendVerificationResponse> adminResendVerification(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new AdminResendVerificationResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/admin/resend-verification")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, AdminResendVerificationResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                AdminResendVerificationResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<CreateUserResponse> createUser(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String bearerToken = getBearerTokenForForwarding(authHeader);

        if (bearerToken == null) {
            return Mono.just(new CreateUserResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/users/admin/create")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, CreateUserResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                CreateUserResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }
}
