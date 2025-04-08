package com.andrels.ms_servicos.configuracao;

import java.lang.reflect.Method;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;
    
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        return http
        .csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth ->{
            auth.requestMatchers(HttpMethod.GET, "/api/servicosprestados/**").permitAll();
            auth.anyRequest().authenticated();
        })
        .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://192.168.1.104:8023","http://192.168.1.104:3000","http://localhost:3000", 
        "http://localhost:8023", "http://192.168.1.100:8023","http://192.168.1.100:3000","http://192.168.1.101:3000", "http://192.168.1.101:8023","http://192.168.1.103:3000", "http://192.168.1.103:8023"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowCredentials(false);
        configuration.setAllowedHeaders(Arrays.asList("Host","Authorization","Content-Type", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        configuration.setExposedHeaders(Arrays.asList("X-Get-Header"));
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    } 
    @Bean
    AuthenticationManager getAuthentication(AuthenticationConfiguration config) throws Exception {
        var authManager = config.getAuthenticationManager();
        return authManager;
    }

     @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    } 
}
