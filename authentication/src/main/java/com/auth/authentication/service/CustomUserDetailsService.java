package com.auth.authentication.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.auth.authentication.repositorio.UserRepositorio;
@Service
public class CustomUserDetailsService implements UserDetailsService{

    @Autowired
    private UserRepositorio userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.auth.authentication.models.User user = userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not Found"));
        
        return new User(user.getUsername(), user.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_"+user.getRole())));
        
    }
    
}
