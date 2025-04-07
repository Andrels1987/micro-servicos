package com.condominio.repositorios;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.condominio.models.PrestadorDeServico;

public interface RepositorioDePrestadores extends MongoRepository<PrestadorDeServico, String>{
    
}
