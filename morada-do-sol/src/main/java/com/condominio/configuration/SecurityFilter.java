package com.condominio.configuration;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.condominio.Services.AuthorizationService;
import com.condominio.Services.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component
public class SecurityFilter extends OncePerRequestFilter {
    
   @Autowired
    TokenService tokenService;

    @Autowired
    AuthorizationService authService;
   
    
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {        
            
        var token = this.recoverToken(request);
         if (token != null) {              
            //var username = tokenService.validateToken(token);
            var username = tokenService.extractUsername(token);
            System.out.println("USERNAME : " + username);
            System.out.println("TOKEN : " + token);
            System.out.println();
            System.out.println();
            if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
                UserDetails userdetails = authService.loadUserByUsername(username);
                var authentication = new UsernamePasswordAuthenticationToken(userdetails, null, userdetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest req) {
        var authHeader = req.getHeader("Authorization");
        if (authHeader == null) {
            return null;
        }
        return authHeader.replace("Bearer ", "");

    } 

}
