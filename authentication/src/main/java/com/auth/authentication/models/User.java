package com.auth.authentication.models;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document("user")
public class User {
    @Id
    private ObjectId id;
    private String username;
    private String password;
    private String role;
    private String email;
}
