package com.auth.authentication.exceptions;

public class TokenExpiredException extends Exception {

    public TokenExpiredException(String message){
        super(message);
    }
    
}
