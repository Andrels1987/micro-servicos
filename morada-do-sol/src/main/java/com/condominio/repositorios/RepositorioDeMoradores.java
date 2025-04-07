package com.condominio.repositorios;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.condominio.models.Moradores;


public interface RepositorioDeMoradores extends MongoRepository<Moradores, String>{
    public Moradores getMoradorByNome(String nome);
    @Query("{'_id' : ?0}")
    public Moradores getDependenteById(String id);
}
