package com.auth.authentication.exceptions;

public class InvalidTokenException extends Exception {
    
    public InvalidTokenException(String message){
        super(message);
    }
}
