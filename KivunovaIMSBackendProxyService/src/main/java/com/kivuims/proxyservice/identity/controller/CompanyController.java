package com.kivuims.proxyservice.identity.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kivuims.proxyservice.identity.model.*;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;
import java.util.HashMap;
import java.util.Map;

@Controller
public class CompanyController {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public CompanyController(WebClient.Builder webClientBuilder,
            @Value("${identity.base-url}") String identityBaseUrl) {
        this.webClient = webClientBuilder.baseUrl(identityBaseUrl).build();
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

    @MutationMapping
    public Mono<RegisterResponse> register(@Argument("input") Map<String, Object> input) {
        return webClient.post()
                .uri("/onboarding/register")
                .bodyValue(input)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, RegisterResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(
                                objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}", RegisterResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<ApproveCompanyResponse> approveCompany(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new ApproveCompanyResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.patch()
                .uri("/super/companies/approve")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, ApproveCompanyResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                ApproveCompanyResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<UpdateCompanyStatusResponse> updateCompanyStatus(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new UpdateCompanyStatusResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.patch()
                .uri("/super/companies/status")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, UpdateCompanyStatusResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                UpdateCompanyStatusResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }

    @MutationMapping
    public Mono<UpdateCompanyAdminStatusResponse> updateCompanyAdminStatus(
            @Argument("input") Map<String, Object> input,
            @ContextValue(name = "Authorization", required = false) String authHeader) {

        String accessToken = extractAccessTokenFromHeader(authHeader);
        String bearerToken = validateAndCreateAuthHeader(accessToken);

        if (bearerToken == null) {
            return Mono.just(new UpdateCompanyAdminStatusResponse(IdentityErrorCode.UNAUTHORIZED.name()));
        }

        Map<String, Object> requestBody = createRequestBody(input);

        return webClient.patch()
                .uri("/super/companies/admins/status")
                .header("Authorization", bearerToken)
                .bodyValue(requestBody)
                .exchangeToMono(response -> response.bodyToMono(String.class))
                .flatMap(json -> forwardResponseAsIs(json, UpdateCompanyAdminStatusResponse.class))
                .onErrorResume(WebClientRequestException.class, ex -> {
                    try {
                        return Mono.just(objectMapper.readValue("{\"code\":\"SERVICE_UNAVAILABLE\"}",
                                UpdateCompanyAdminStatusResponse.class));
                    } catch (Exception e) {
                        return Mono.error(ex);
                    }
                });
    }
}
