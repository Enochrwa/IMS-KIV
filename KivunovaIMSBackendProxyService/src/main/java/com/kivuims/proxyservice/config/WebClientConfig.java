package com.kivuims.proxyservice.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * WebClient configuration that automatically forwards Authorization header
 * from Reactor Context to downstream microservice requests.
 */
@Configuration
public class WebClientConfig {

    private static final Logger logger = LoggerFactory.getLogger(WebClientConfig.class);
    private static final String AUTHORIZATION_HEADER_KEY = "AUTHORIZATION_HEADER";

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
                .filter(authorizationHeaderFilter());
    }

    /**
     * Exchange filter that reads Authorization header from Reactor Context
     * and adds it to all outgoing WebClient requests.
     * Only adds the header if it's not already present in the request.
     */
    private ExchangeFilterFunction authorizationHeaderFilter() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest ->
            Mono.deferContextual(ctx -> {
                // Check if Authorization header is already present
                if (clientRequest.headers().containsKey(HttpHeaders.AUTHORIZATION)) {
                    logger.debug("Authorization header already present in request - skipping automatic addition");
                    return Mono.just(clientRequest);
                }

                // Get Authorization header from Reactor Context
                Object authHeader = ctx.getOrDefault(AUTHORIZATION_HEADER_KEY, null);

                if (authHeader instanceof String && !((String) authHeader).isBlank()) {
                    String bearerToken = (String) authHeader;

                    logger.debug("Forwarding Authorization header to downstream service: {}", bearerToken);

                    ClientRequest filteredRequest = ClientRequest.from(clientRequest)
                            .header(HttpHeaders.AUTHORIZATION, bearerToken)
                            .build();

                    return Mono.just(filteredRequest);
                } else {
                    logger.debug("No Authorization header in context - request will be sent without token");
                    return Mono.just(clientRequest);
                }
            })
        );
    }
}
