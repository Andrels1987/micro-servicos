package com.auth.authentication.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

@Component
public class JwtUtils {
    
    @Value("${spring-secret-key}")
    private String SECRET;

    public String generateToken(String username){
        System.out.println("SECRET: "+SECRET);
        return JWT.create()
        .withSubject(username)
        .withExpiresAt(new Date(System.currentTimeMillis() + 86400000))
        .sign(Algorithm.HMAC256(SECRET));
    }

    public String extractUsername(String token){
        return JWT.require(Algorithm.HMAC256(SECRET))
        .build()
        .verify(token)
        .getSubject();
    }
     public boolean isTokenValid(String token, UserDetails userDetails){
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername());
     }
    
}
