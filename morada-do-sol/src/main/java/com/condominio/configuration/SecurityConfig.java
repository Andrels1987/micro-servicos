package com.condominio.configuration;

import java.util.Arrays;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
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

import com.mongodb.client.MongoClients;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

   @Autowired
    SecurityFilter securityFilter;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
         System.out.println("PRIMEIRO ACESSO");
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                .authorizeHttpRequests(auth -> {                    
                    
                    auth.requestMatchers(HttpMethod.GET, "/prestadores").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/add/prestador").permitAll();
                    auth.requestMatchers(HttpMethod.DELETE, "/delete/prestador").permitAll();
                    auth.requestMatchers(HttpMethod.PUT, "/update/prestador").permitAll();
                    auth.anyRequest().authenticated();
                })
                .logout((logout) -> logout
                    .logoutSuccessUrl("/auth/logout")
                    .permitAll()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)

                /*
                 * .oauth2Login(Customizer.withDefaults())
                 * .formLogin(Customizer.withDefaults())
                 */
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

    @Bean
    ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    MongoTemplate mongoTemplate() {
        return new MongoTemplate(MongoClients.create("mongodb+srv://Andrels:V14dh7REowrXpp4G@projectmern.i26wage.mongodb.net/?retryWrites=true&w=majority&appName=ProjectMERN"), "test");
    }

}