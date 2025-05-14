package com.auth.authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.auth.authentication.exceptions.ErrorSavingUserException;
import com.auth.authentication.exceptions.InvalidTokenException;
import com.auth.authentication.exceptions.TokenExpiredException;
import com.auth.authentication.models.ResetPasswordDto;
import com.auth.authentication.models.TokenRequest;
import com.auth.authentication.models.User;
import com.auth.authentication.repositorio.TokenRepositorio;
import com.auth.authentication.repositorio.UserRepositorio;
import com.auth.authentication.security.JwtUtils;
import com.auth.authentication.service.AuthService;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    

    @InjectMocks
    private AuthService authService;

    @Mock
    private TokenRepositorio tokenRepositorio;

    @Mock
    private UserRepositorio userRepositorio;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;


    @Test
    public void testRedefirSenhaComSucesso() throws TokenExpiredException, InvalidTokenException, ErrorSavingUserException{
        //Arrange
        String token = "valid.token.here";
        String newPass = "mynewpass";
        ResetPasswordDto dto = new ResetPasswordDto(token, newPass);

        TokenRequest tokenRequest = new TokenRequest(new ObjectId(), new ObjectId(),token, LocalDateTime.now().plusMinutes(10));

        User user = new User();
        user.setUsername("usuario");
        user.setPassword("senhaAntiga");

        when(tokenRepositorio.findByToken(token)).thenReturn(Optional.of(tokenRequest));
        when(jwtUtils.extractUsername(token)).thenReturn("usuario");
        when(userRepositorio.findByUsername("usuario")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(newPass)).thenReturn("senhaCriptografada");

        String result = authService.redefinirSenha(dto);
        assertEquals("Senha atualizada com sucesso", result);
        verify(userRepositorio).save(user);
        verify(tokenRepositorio).delete(tokenRequest);
    }
}
