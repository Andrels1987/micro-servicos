package com.andrels.ms_servicos.modelos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoradorDtoSuccess extends MoradorDto{
     private String id;                         
     private String nome;                                                        
     private String bloco;
     private String apartamento;
 
} 