package com.andrels.ms_morador.modelos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class VeiculoDto {

        private String _id; 
        private String placa;
        private String modelo;
        private String marca;
        private String cor;
        private String vaga;
        private String observacao;
        private String foto;
        private String tipoDeAutorizacao;
        private String err;
       

}
