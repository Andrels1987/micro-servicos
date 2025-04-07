package com.condominio.models;

import java.util.List;

public record MoradorDTO( 
    List<Veiculo> listaVeiculos, 
    String nome, 
    String sobrenome, 
    String apartamento, 
    Character bloco,  
    String foto, 
    String telefone,  
    List<Dependente> listaDependentes) {}
