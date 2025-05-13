package com.auth.authentication.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.token.TokenService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth.authentication.exceptions.UserNotFoundException;
import com.auth.authentication.models.AuthRequest;
import com.auth.authentication.models.AuthResponse;
import com.auth.authentication.models.EmailRequest;
import com.auth.authentication.models.ResetPasswordDto;
import com.auth.authentication.models.User;
import com.auth.authentication.repositorio.UserRepositorio;
import com.auth.authentication.security.JwtUtils;
import com.auth.authentication.service.AuthService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    


    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        String response = authService.authenticate(request);
        return ResponseEntity.ok(new AuthResponse(response));
    }
    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
       try {
            authService.register(request);
            return ResponseEntity.ok("Usuário registrado com sucesso");
       } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
       }
    }
    
    @PostMapping("auth/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody EmailRequest email){
        try {
            String response = authService.enviarEmailRedeficaoSenha(email.getEmail());
            return ResponseEntity.ok().body(new AuthResponse(response));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AuthResponse(e.getMessage()));
        }
    }
    
    @PostMapping("auth/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto){
        try {
            
             String response = authService.redefinirSenha(resetPasswordDto);            
            return ResponseEntity.ok().body(new AuthResponse(response));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AuthResponse(e.getMessage()));
        }
    }

}
