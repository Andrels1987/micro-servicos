package com.condominio.models;

public class SessionDto{
     private static String username;
     //private static String password;
     private static String token;
     
    
    public static void saveToken(String tk){
        token = tk;
    }
    public static void saveUsername(String name){
        username = name;
    }

    public static String showToken(){
        return token;
    }
    public static String showUsername(){
        return username;
    }
    

    
    
}

