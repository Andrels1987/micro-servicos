package com.andrels.ms_servicos.configuracao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import jakarta.servlet.http.HttpServletRequest;

@Component
@RequestScope
public class TokenProvider {
   @Autowired
    private HttpServletRequest request;

    public String getToken() {
        return request.getHeader("Authorization");
    } 
}
