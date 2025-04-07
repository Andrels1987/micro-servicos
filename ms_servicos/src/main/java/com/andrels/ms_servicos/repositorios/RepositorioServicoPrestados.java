package com.andrels.ms_servicos.repositorios;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.andrels.ms_servicos.modelos.ServicoPrestado;

public interface RepositorioServicoPrestados extends MongoRepository<ServicoPrestado, String>{
    
    @Query("{'idPrestadorDeServico': ?0}")
    public List<ServicoPrestado> getServicoPrestadoPeloIdDoPrestador(String idPrestadorDeServico);
    
    @Query("{'idMorador': ?0}")
    public List<ServicoPrestado> getServicoPrestadoPeloIdDoMorador(String idMorador);
    
    @Query("{'dataInicioDoServico': ?0}")
    public List<ServicoPrestado> getServicosPelaData(LocalDateTime dataInicioServico);
}
