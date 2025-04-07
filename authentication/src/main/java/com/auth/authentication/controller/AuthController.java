package com.auth.authentication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth.authentication.models.AuthRequest;
import com.auth.authentication.models.AuthResponse;
import com.auth.authentication.service.AuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api")
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @GetMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        String token = authService.authenticate(request);

        return ResponseEntity.ok(new AuthResponse(token));
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

}
