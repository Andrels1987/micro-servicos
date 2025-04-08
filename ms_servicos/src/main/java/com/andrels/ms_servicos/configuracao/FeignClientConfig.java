package com.andrels.ms_servicos.configuracao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;


import feign.RequestInterceptor;
import feign.RequestTemplate;
@Configuration
public class FeignClientConfig implements RequestInterceptor{



    @Autowired
    private TokenProvider tokenProvider;

    @Override
    public void apply(RequestTemplate template) {
        String token = tokenProvider.getToken();
        if (token != null && !token.isEmpty()) {
            template.header("Authorization", token);
        }
    }

  
    
}
