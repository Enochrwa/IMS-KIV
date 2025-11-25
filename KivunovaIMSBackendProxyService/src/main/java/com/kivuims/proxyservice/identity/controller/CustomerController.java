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
public class CustomerController {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public CustomerController(WebClient.Builder webClientBuilder,
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
    public Mono<CreateCustomerResponse> createCustomer(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new CreateCustomerResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/customers/admin/create")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, CreateCustomerResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                CreateCustomerResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<UpdateCustomerResponse> updateCustomer(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new UpdateCustomerResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.patch()
                .uri("/company/customers/admin/update")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, UpdateCustomerResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                UpdateCustomerResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<DeleteCustomerResponse> deleteCustomer(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new DeleteCustomerResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.method(HttpMethod.DELETE)
                .uri("/company/customers/admin/delete")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, DeleteCustomerResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                DeleteCustomerResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @QueryMapping
    public Mono<ListCustomersResponse> listCustomers(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new ListCustomersResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/customers/admin/list")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, ListCustomersResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                ListCustomersResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @QueryMapping
    public Mono<GetCustomerResponse> getCustomer(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new GetCustomerResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.post()
                .uri("/company/customers/admin/get")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, GetCustomerResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                GetCustomerResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }
}
