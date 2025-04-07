package com.condominio.repositorios;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.condominio.models.EntregaServico;

public interface RepositorioEntregaServico extends MongoRepository<EntregaServico, String>{
    
}
