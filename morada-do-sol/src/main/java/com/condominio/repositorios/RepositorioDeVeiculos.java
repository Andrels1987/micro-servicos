package com.condominio.repositorios;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.condominio.models.Veiculo;

public interface RepositorioDeVeiculos extends MongoRepository<Veiculo, String>{
 public Veiculo getVeiculoById(String id);

    @Query("{'placa': ?0}")
    public Veiculo getVeiculoPelaPlaca(String placa);
}