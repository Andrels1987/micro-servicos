package com.condominio.Services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.condominio.models.User;

@Service
public class TokenService {
    
    @Value("${api.security.token.secret}")
    public String secret;

    public String generateToken(User user){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
            .withIssuer("morada-do-sol")
            .withSubject(user.getLoginEmail())
            .withExpiresAt(generateExpirationDate())
            .sign(algorithm);
            return token;
        } catch (JWTCreationException e) {
            System.out.println(e.getMessage());
            throw new RuntimeException("erro ao criar token: " + e);
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

    public Instant generateExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
