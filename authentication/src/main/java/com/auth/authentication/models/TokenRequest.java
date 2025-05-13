package com.auth.authentication.models;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class TokenRequest {
    @Id
    private ObjectId id;
    private ObjectId userid;
    private String token;
    private LocalDateTime expirationDate;

    public TokenRequest(ObjectId userid, String token, LocalDateTime expTime){
        this.userid = userid;
        this.token = token;
        this.expirationDate = expTime;
    }
}
