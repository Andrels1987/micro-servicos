package com.andrels.ms_servicos.servicos;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;

@Service
public class TokenService {
    
    @Value("${api.security.token.secret}")
    public String secret;


    public String generateToken(User user){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
            .withSubject(user.getUsername())
            .withExpiresAt(generateExpirationDate())            
            .sign(algorithm);            
            return token;
        } catch (Exception e) {
            return "";
        }
    }

    public String extractUsername(String token){
        return JWT.require(Algorithm.HMAC256(secret))
        .build()
        .verify(token)
        .getSubject();
    }

     public String validateToken(String token){
         try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
            .withIssuer("morada-do-sol")
            .build()
            .verify(token)
            .getSubject();
         } catch (JWTVerificationException e) {
            System.out.println("ERROR : " + e);
            return "";    
         }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
