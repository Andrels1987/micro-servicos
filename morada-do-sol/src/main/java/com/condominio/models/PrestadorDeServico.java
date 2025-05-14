package com.condominio.models;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("prestadores")
public class PrestadorDeServico {
    @Id
    private String id;
    private String nome;
    private String sobrenome;
    private String empresa;
    private String numeroDocumento;
    private String foto;
    private String idVeiculo;
    private String servicoPrestado;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
    private Boolean isAtivo;

    public PrestadorDeServico() {

    }

    public PrestadorDeServico(String id, String nome,
            String sobrenome, String numeroDocumento,
            String empresa, String foto,
            LocalDateTime criadoEm, LocalDateTime atualizadoEm,
            String idVeiculo, String servicoPrestado,
            Boolean isAtivo) {
        this.id = id;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.numeroDocumento = numeroDocumento;
        this.empresa = empresa;
        this.foto = foto;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        this.idVeiculo = idVeiculo;
        this.servicoPrestado = servicoPrestado;
        this.isAtivo = isAtivo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public String getEmpresa() {
        return empresa;
    }

    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {

        this.id = id;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

    public String getIdVeiculo() {
        return idVeiculo;
    }

    public void setIdVeiculo(String idVeiculo) {
        this.idVeiculo = idVeiculo;
    }

    public String getServicoPrestado() {
        return servicoPrestado;
    }

    public void setServicoPrestado(String servicoPrestado) {
        this.servicoPrestado = servicoPrestado;
    }

    @Override
    public String toString() {
        return "PrestadorDeServico [id=" + id + ", nome=" + nome + ", sobrenome=" + sobrenome + ", empresa=" + empresa
                + ", numeroDocumento=" + numeroDocumento + ", foto=" + foto + ", idVeiculo=" + idVeiculo
                + ", servicoPrestado=" + servicoPrestado + ", criadoEm=" + criadoEm + ", atualizadoEm=" + atualizadoEm
                + ", isAtivo=" + isAtivo + "]";
    }

    public Boolean getIsAtivo() {
        return isAtivo;
    }

    public void setIsAtivo(Boolean isAtivo) {
        this.isAtivo = isAtivo;
    }

    

}
