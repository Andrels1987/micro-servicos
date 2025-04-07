package com.andrels.ms_morador.modelos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoradorDto{
    private String id;
    private String nome;
    private  String sobrenome;
    private String apartamento;
    private Character bloco;
    private List<VeiculoDto> veiculos;
    private String foto;
    private String telefone;    
    private List<DependenteInfo> dependentes;
    private LocalDateTime criadoEm;
    private LocalDateTime modificadoEm;
    private String documento;



    public MoradorDto(String id, String nome, String sobrenome, String foto){
        this.id = id;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.foto = foto;
    }
}
 
