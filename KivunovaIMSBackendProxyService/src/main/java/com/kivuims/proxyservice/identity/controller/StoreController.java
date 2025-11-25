package com.kivuims.proxyservice.identity.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kivuims.proxyservice.identity.model.AssignStoreAdminResponse;
import com.kivuims.proxyservice.identity.model.CreateStoreResponse;
import com.kivuims.proxyservice.identity.model.IdentityErrorCode;
import com.kivuims.proxyservice.identity.model.ListStoresResponse;
import com.kivuims.proxyservice.identity.model.UpdateStoreResponse;
import com.kivuims.proxyservice.identity.model.UpdateStoreStatusResponse;
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
public class StoreController {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public StoreController(WebClient.Builder webClientBuilder, @Value("${identity.base-url}") String identityBaseUrl) {
        this.webClient = webClientBuilder.baseUrl(identityBaseUrl).build();
    }

    private String extractAccessTokenFromHeader(String authHeader) {
        if (authHeader == null || authHeader.trim().isEmpty()) {
            return null;
        }
        if (authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }
        return authHeader.trim();
    }

    private String validateAndCreateAuthHeader(String accessToken) {
        if (accessToken == null || accessToken.trim().isEmpty()) {
            return null;
        }
        return "Bearer " + accessToken.trim();
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

    @MutationMapping
    public Mono<CreateStoreResponse> createStore(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new CreateStoreResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/admin/stores")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, CreateStoreResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                CreateStoreResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<UpdateStoreResponse> updateStore(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new UpdateStoreResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.put()
                .uri("/company/admin/stores/update")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, UpdateStoreResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                UpdateStoreResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<AssignStoreAdminResponse> assignStoreAdmin(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new AssignStoreAdminResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/admin/stores/assign-admin")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, AssignStoreAdminResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                AssignStoreAdminResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<UpdateStoreStatusResponse> updateStoreStatus(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new UpdateStoreStatusResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.patch()
                .uri("/company/admin/stores/status")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, UpdateStoreStatusResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                UpdateStoreStatusResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @QueryMapping
    public Mono<ListStoresResponse> listStores(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new ListStoresResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/admin/stores/list")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, ListStoresResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                ListStoresResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }
}
