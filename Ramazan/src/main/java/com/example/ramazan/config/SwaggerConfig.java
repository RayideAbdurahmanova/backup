package com.example.ramazan.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        Server server = new Server();
        server.setUrl("https://apirequest.iftar.az");

        OpenAPI openAPI = new OpenAPI();
        openAPI.addServersItem(server);

        return openAPI;
    }
}
