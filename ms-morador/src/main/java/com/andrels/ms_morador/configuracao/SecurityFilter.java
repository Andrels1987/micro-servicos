package com.andrels.ms_morador.configuracao;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.andrels.ms_morador.servicos.AuthenticationService;
import com.andrels.ms_morador.servicos.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@Component
public class SecurityFilter extends OncePerRequestFilter {


    @Autowired
    TokenService tokenService;

    @Autowired
    AuthenticationService authService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String token = recoverToken(request);
        
        if(token != null){
            String username = tokenService.extractUsername(token);
            System.out.println();
        System.out.println();
        System.out.println("TOKEN : " + username);
        System.out.println();
            if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
                UserDetails userDetails = authService.loadUserByUsername(username);
                var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
    
    public String recoverToken(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);
       
        return token;
    }
}
