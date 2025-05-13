package com.auth.authentication.repositorio;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.auth.authentication.models.TokenRequest;

public interface TokenRepositorio extends MongoRepository<TokenRequest, String>{

    public Optional<TokenRequest> findByToken(String token);
    
}
