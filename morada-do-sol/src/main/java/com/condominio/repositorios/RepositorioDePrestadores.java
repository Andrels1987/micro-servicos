package com.condominio.repositorios;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.condominio.models.PrestadorDeServico;

public interface RepositorioDePrestadores extends MongoRepository<PrestadorDeServico, String>{

    @Query("{'isAtivo': true}")
    public List<PrestadorDeServico> findAllActivePrestadores();
}
