package com.condominio.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Veiculo {
    @Id
    private String id ;
    private String modelo;
    private String cor;
    private String foto;
    private String placa;
    private String vaga;
    private String marca;
    public Veiculo() {
    }
    public Veiculo(String id, String modelo, String cor, String foto, String placa, String vaga, String marca) {
        this.id = id;
        this.modelo = modelo;
        this.cor = cor;
        this.foto = foto;
        this.placa = placa;
        this.vaga = vaga;
        this.marca = marca;
    }
    public Veiculo(String modelo, String cor, String foto, String placa, String vaga, String marca) {
        this.modelo = modelo;
        this.cor = cor;
        this.foto = foto;
        this.placa = placa;
        this.vaga = vaga;
        this.marca = marca;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getModelo() {
        return modelo;
    }
    public void setModelo(String modelo) {
        this.modelo = modelo;
    }
    public String getCor() {
        return cor;
    }
    public void setCor(String cor) {
        this.cor = cor;
    }
    public String getFoto() {
        return foto;
    }
    public void setFoto(String foto) {
        this.foto = foto;
    }
    public String getPlaca() {
        return placa;
    }
    public void setPlaca(String placa) {
        this.placa = placa;
    }
    public String getVaga() {
        return vaga;
    }
    public void setVaga(String vaga) {
        this.vaga = vaga;
    }
    public String getMarca() {
        return marca;
    }
    public void setMarca(String marca) {
        this.marca = marca;
    }
    @Override
    public String toString() {
        return "Veiculo [id=" + id + ", modelo=" + modelo + ", cor=" + cor + ", foto=" + foto + ", placa=" + placa
                + ", vaga=" + vaga + ", marca=" + marca + "]";
    }

    
}
