package com.andrels.ms_morador.modelos;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("morador")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Morador {
    @Id
    private String id;
    private String nome;
    private String sobrenome;
    private String documento;
    private String apartamento;
    private String bloco;
    private List<String> veiculos;
    private String foto;
    private String telefone;    
    List<DependenteDto> dependentes;
    private LocalDateTime criadoEm;
    private LocalDateTime modificadoEm;
    private Boolean ativo;

    


    public Morador(String nome, String sobrenome, String apartamento, String bloco, List<String> idVeiculos,
            String foto, String telefone, List<DependenteDto> dependentes, LocalDateTime criadoEm, String documento) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.apartamento = apartamento;
        this.bloco = bloco;
        this.veiculos = idVeiculos;
        this.foto = foto;
        this.telefone = telefone;
        this.dependentes = dependentes;
        this.criadoEm = criadoEm;
        this.documento = documento;
    }



    

    
}
