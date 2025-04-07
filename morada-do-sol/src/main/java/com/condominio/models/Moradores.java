package com.condominio.models;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document("morador")
public class Moradores {
    @Id
    private String id;
    private String nome;
    private String sobrenome;
    private String apartamento;
    private Character bloco;
    @DocumentReference
    private List<Veiculo> veiculos;
    private String foto;
    private String telefone;    
    private List<Dependente> dependentes;
    private LocalDateTime criadoEm;

    public Moradores() {            
    }


    public Moradores(String id, String nome, String sobrenome, String apartamento, Character bloco, String foto,
            String telefone, List<Dependente> dependentes, LocalDateTime criadoEm, List<Veiculo> veiculos) {
        this.id = id;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.apartamento = apartamento;
        this.bloco = bloco;
        this.foto = foto;
        this.telefone = telefone;
        this.dependentes = dependentes;
        this.criadoEm = criadoEm;
        this.veiculos = veiculos;
    }
    public Moradores(String nome, String sobrenome, String apartamento, Character bloco, String foto,
            String telefone, List<Dependente> dependentes, LocalDateTime criadoEm, List<Veiculo> veiculos) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.apartamento = apartamento;
        this.bloco = bloco;
        this.foto = foto;
        this.telefone = telefone;
        this.dependentes = dependentes;
        this.criadoEm = criadoEm;
        this.veiculos = veiculos;
    }

    
    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public Character getBloco() {
        return bloco;
    }

    public void setBloco(Character bloco) {
        this.bloco = bloco;
    }

    public String getApartamento() {
        return apartamento;
    }

    public void setApartamento(String apartamento) {
        this.apartamento = apartamento;
    }

    public List<Dependente> getDependentes() {
        return dependentes;
    }

    public void setDependentes(List<Dependente> dependentes) {
        this.dependentes = dependentes;
    }

    public List<Veiculo> getVeiculo() {
        return this.veiculos;
    }

    public void setVeiculo(List<Veiculo> veiculos) {
        this.veiculos = veiculos;
    }

    @Override
    public String toString() {
        return "Moradores \n[id=" + id + ", \nnome=" + nome + ", \nsobrenome=" + sobrenome + ", \napartamento=" + apartamento
                + ", \nbloco=" + bloco + ", \nveiculos=" + veiculos + ", \nfoto=" + foto + ", \ntelefone=" + telefone
                + ", \ndependentes=" + dependentes + ", \ncriadoEm=" + criadoEm + "]";
    }

    
}
