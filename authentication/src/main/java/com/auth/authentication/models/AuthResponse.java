package com.auth.authentication.models;

import lombok.Data;

@Data
public class AuthResponse {
    private  String response;

    public AuthResponse(String response){
        this.response = response;
    }
}
