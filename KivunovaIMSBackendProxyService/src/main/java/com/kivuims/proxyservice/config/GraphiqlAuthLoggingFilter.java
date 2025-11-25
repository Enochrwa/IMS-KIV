package com.kivuims.proxyservice.config;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class GraphiqlAuthLoggingFilter implements WebFilter {

    private static final String AUTHORIZATION_HEADER_KEY = "AUTHORIZATION_HEADER";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();

        if (path.startsWith("/graphiql") || path.equals("/graphql")) {
            HttpHeaders headers = exchange.getRequest().getHeaders();
            String authHeader = headers.getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader != null && !authHeader.isBlank()) {
                return chain.filter(exchange)
                        .contextWrite(ctx -> ctx.put(AUTHORIZATION_HEADER_KEY, authHeader));
            }
        }

        return chain.filter(exchange);
    }
}
