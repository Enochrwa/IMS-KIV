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
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Controller
public class SupplierController {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public SupplierController(WebClient.Builder webClientBuilder,
            @Value("${identity.base-url}") String identityBaseUrl) {
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
    public Mono<CreateSupplierResponse> createSupplier(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.error(new RuntimeException("UNAUTHORIZED"));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/admin/suppliers")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, CreateSupplierResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    return Mono.error(ex);
                });
    }

    @MutationMapping
    public Mono<UpdateSupplierResponse> updateSupplier(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.error(new RuntimeException("UNAUTHORIZED"));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/admin/suppliers/update")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, UpdateSupplierResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    return Mono.error(ex);
                });
    }

    @MutationMapping
    public Mono<AddStoreSupplierResponse> addStoreSupplier(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.error(new RuntimeException("UNAUTHORIZED"));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/admin/stores/suppliers/add")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, AddStoreSupplierResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    return Mono.error(ex);
                });
    }

    @MutationMapping
    public Mono<RemoveStoreSupplierResponse> removeStoreSupplier(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.error(new RuntimeException("UNAUTHORIZED"));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.method(HttpMethod.DELETE)
                .uri("/company/admin/stores/suppliers/remove")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, RemoveStoreSupplierResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    return Mono.error(ex);
                });
    }

    @QueryMapping
    public Mono<SearchSuppliersResponse> searchSuppliers(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.error(new RuntimeException("UNAUTHORIZED"));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/admin/suppliers/search")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> {
                    try {
                        // The API returns an array directly, so we need to wrap it
                        java.util.List<Supplier> suppliers = objectMapper.readValue(json,
                                new TypeReference<java.util.List<Supplier>>() {
                                });
                        SearchSuppliersResponse response = new SearchSuppliersResponse();
                        response.setSuppliers(suppliers);
                        return Mono.just(response);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                })
                .onErrorResume(WebClientRequestException.class, ex -> {
                    return Mono.error(ex);
                });
    }
}
