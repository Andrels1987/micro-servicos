package com.auth.authentication.repositorio;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.auth.authentication.models.User;

public interface UserRepositorio extends MongoRepository<User, String>  {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
