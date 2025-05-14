package com.andrels.ms_morador.repositorio;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.andrels.ms_morador.modelos.Morador;

public interface RepositorioMorador extends MongoRepository<Morador, String>{
    @Query("{'ativo' : true}")
    public List<Morador> findAllMoradores();

    @Query("{'cpf' : ?0}")
    public Morador getMoradorPeloCpf(String cpf);
    
    @Query("{'placaVeiculos' : ?0}")
    public Morador getMoradorPelaPlacaDoVeiculo(String placa);
    @Query("{'id' : ?0}")
    public Morador getMoradorPeloIdDoDoVeiculo(String id);

    @Query("{'documento' : ?0}")
    public Morador getMoradorPeloNumeroDoDocumento(String documento);
}
