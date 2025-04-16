package com.auth.authentication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth.authentication.models.AuthRequest;
import com.auth.authentication.models.User;
import com.auth.authentication.repositorio.UserRepositorio;
import com.auth.authentication.security.JwtUtils;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtil;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UserRepositorio userRepo;
    
    public String authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String username = authentication.getName();
        return jwtUtil.generateToken(username);
    }

    public void register(AuthRequest request){
        var user = userRepo.findByUsername(request.getUsername());

        if(user.isPresent()){
            throw new IllegalArgumentException("Usuario ja existe");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername()); 
        newUser.setPassword(encoder.encode(request.getPassword()));
        newUser.setRole(request.getRole().toUpperCase());

        userRepo.save(newUser);

    }
}
