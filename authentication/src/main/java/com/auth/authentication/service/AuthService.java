package com.auth.authentication.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth.authentication.exceptions.ErrorSavingUserException;
import com.auth.authentication.exceptions.InvalidTokenException;
import com.auth.authentication.exceptions.TokenExpiredException;
import com.auth.authentication.exceptions.UserNotFoundException;
import com.auth.authentication.models.AuthRequest;
import com.auth.authentication.models.ResetPasswordDto;
import com.auth.authentication.models.TokenRequest;
import com.auth.authentication.models.User;
import com.auth.authentication.repositorio.TokenRepositorio;
import com.auth.authentication.repositorio.UserRepositorio;
import com.auth.authentication.security.JwtUtils;
import com.auth.authentication.serviceImpl.EmailServiceImpl;
import com.auth0.jwt.JWT;

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

    @Autowired
    private TokenRepositorio tokenRepositorio;

    @Autowired
    private EmailServiceImpl emailServiceImpl;
    
    public String authenticate(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
            
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String username = authentication.getName();
        return jwtUtil.generateToken(username);
        } catch (Exception e) {
            return e.getMessage();
        }
        
    }

    public void register(AuthRequest request){
        var user = userRepo.findByUsername(request.getUsername());

        if(user.isPresent()){
            throw new IllegalArgumentException("Usuario ja existe");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername()); 
        newUser.setEmail(request.getEmail());
        newUser.setPassword(encoder.encode(request.getPassword()));
        newUser.setRole(request.getRole().toUpperCase());

        userRepo.save(newUser);

    }

    public String enviarEmailRedeficaoSenha(String email) {
        Optional<User> userExists = userRepo.findByEmail(email);
        if(userExists.isEmpty()){
            throw new UserNotFoundException("Usuario com email "+ email + " não encontrado");
        }
        System.out.println("USER: "+ userExists.get());
        User user = userExists.get();
        //Gera token
        String token = jwtUtil.generateToken(user.getUsername());

        //Armazena esse token associado ao usuário (em memória, banco ou cache).
        Date expireAt = JWT.decode(token).getExpiresAt();
        LocalDateTime expTime = expireAt.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        long diff = ChronoUnit.HOURS.between(LocalDateTime.now(), expTime);
        System.out.println("O token expira em " + diff + " horas");
        tokenRepositorio.save(new TokenRequest(user.getId(), token, expTime));
        //sending email
        String resetLink = "http://localhost:3000/esqueceu-senha/reset-password?token="+token;
        emailServiceImpl.send(user.getEmail(),
        "redefinição de senha", 
        "Clique no link abaixo para redefinir sua senha:" + resetLink);
        return "E-mail de recuperação enviado";
    }
    
    
    public String redefinirSenha(ResetPasswordDto resetPasswordDto) throws TokenExpiredException, InvalidTokenException, ErrorSavingUserException {
        
        Optional<TokenRequest> tokenOpt = tokenRepositorio.findByToken(resetPasswordDto.token());
        if(tokenOpt.isEmpty()){
            throw new InvalidTokenException("Token invalid");
        }
        TokenRequest tokenRequest = tokenOpt.get();
        if(tokenRequest.getExpirationDate().isBefore(LocalDateTime.now())){
            throw new TokenExpiredException("Token Expirou");
        }

        String username = jwtUtil.extractUsername(tokenRequest.getToken());
        Optional<User> userOpt = userRepo.findByUsername(username);
        if(userOpt.isEmpty()){
            throw new UserNotFoundException("Usuario com unsername "+ username + " não encontrado");
        }
        User user = userOpt.get();
        user.setPassword(encoder.encode(resetPasswordDto.newPassword()));

        try {
            userRepo.save(user);
            tokenRepositorio.delete(tokenRequest);
            
        } catch (Exception e) {
            throw new ErrorSavingUserException(e.getMessage());
        }
        
        return "Senha atualizada com sucesso";
    }
}
