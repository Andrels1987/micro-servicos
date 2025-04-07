package com.andrels.ms_morador.modelos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DependenteInfo {
    private String parentesco;
    private String _id;
    private String nome;
    private String sobrenome;
}
