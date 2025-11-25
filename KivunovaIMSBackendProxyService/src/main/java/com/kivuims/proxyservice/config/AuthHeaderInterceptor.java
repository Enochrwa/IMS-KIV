package com.kivuims.proxyservice.config;

import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import java.util.Map;

@Component
public class AuthHeaderInterceptor implements WebGraphQlInterceptor {

    private static final String AUTHORIZATION_HEADER_KEY = "AUTHORIZATION_HEADER";
    private static final String GRAPHQL_CONTEXT_KEY = "Authorization";

    @Override
    public Mono<WebGraphQlResponse> intercept(WebGraphQlRequest request, Chain chain) {
        return Mono.deferContextual(ctx -> {
            Object contextToken = ctx.getOrDefault(AUTHORIZATION_HEADER_KEY, null);
            String bearerToken = null;

            if (contextToken instanceof String) {
                bearerToken = (String) contextToken;
            }

            if (bearerToken != null && !bearerToken.isBlank()) {
                final String tokenForContext = bearerToken;
                request.configureExecutionInput((executionInput, builder) -> builder
                        .graphQLContext(Map.of(GRAPHQL_CONTEXT_KEY, tokenForContext)).build());
            }

            return chain.next(request);
        });
    }
}
