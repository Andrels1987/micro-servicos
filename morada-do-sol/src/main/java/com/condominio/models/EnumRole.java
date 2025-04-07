package com.condominio.models;

public enum EnumRole {
    ADMIN("ADMIN"),
    USER("USER"),
    MODERATOR("MODERATOR");


    public String role;

    EnumRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
