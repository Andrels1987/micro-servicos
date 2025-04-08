package com.condominio.models;

import java.util.Collection;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails; 



@Document("user")
public class User implements UserDetails {
      
    @Id
    private String id;
    private String fullname;
    @Indexed(unique = true, direction = IndexDirection.DESCENDING)
    private String loginEmail;
    private String password;
    private boolean enabled;

    @DBRef
    private UserRole role;

    
    public User() {
    }


    public User(String usernameAndSurname, String loginEmail, String password) {
        this.fullname = usernameAndSurname;
        this.loginEmail = loginEmail;
        this.password = password;
    }


    public String getId() {
        return id;
    }


    public void setId(String id) {
        this.id = id;
    }


    public String getFullname() {
        return fullname;
    }


    public void setFullname(String usernameAndSurname) {
        this.fullname = usernameAndSurname;
    }


    public String getLoginEmail() {
        return loginEmail;
    }


    public void setLoginEmail(String loginEmail) {
        this.loginEmail = loginEmail;
    }


    public String getPassword() {
        return password;
    }


    public void setPassword(String password) {
        this.password = password;
    }


    


    @Override
    public String toString() {
        return "User [id=" + id + ", fullname=" + fullname + ", loginEmail=" + loginEmail + ", password=" + password
                + ", enabled=" + enabled + ", role=" + role + "]";
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
       
        if(this.role == UserRole.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), 
                                                new SimpleGrantedAuthority("ROLE_USER"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    } 


    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }


    public UserRole getRoles() {
        return role;
    }


    public void setRoles(UserRole roles) {
        this.role = roles;
    }


    @Override
    public String getUsername() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUsername'");
    }


   


    @Override
    public boolean isEnabled() {
        return true;
    }


    @Override
    public boolean isAccountNonExpired() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isAccountNonExpired'");
    }


    @Override
    public boolean isAccountNonLocked() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isAccountNonLocked'");
    }


    @Override
    public boolean isCredentialsNonExpired() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isCredentialsNonExpired'");
    } 

    
}
