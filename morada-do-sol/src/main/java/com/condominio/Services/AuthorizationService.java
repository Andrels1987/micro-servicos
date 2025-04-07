package com.condominio.Services;


import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException; 
import org.springframework.stereotype.Service;


@Service
public class AuthorizationService  implements UserDetailsService  {


   @Override
    //public UserDetails loadUserByUsername(String loginEmail) throws UsernameNotFoundException {
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //MoradaDoSolApplication.whereItIs = "LOADUSERBYUSERNAME";
        
        return User.builder()
        .username(username)
        .password("N/A") // ou uma senha real se você tiver
        .authorities("ROLE_USER") // obrigatoriamente precisa de pelo menos uma authority
        .build();
    } 
    
}
