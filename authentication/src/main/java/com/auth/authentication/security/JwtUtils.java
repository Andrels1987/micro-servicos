package com.auth.authentication.security;

import java.util.Date;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

@Component
public class JwtUtils {
    
    private final String SECRET = "my-secret-key";

    public String generateToken(String username){
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
     public boolean issTokenValid(String token, UserDetails userDetails){
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername());
     }
}
