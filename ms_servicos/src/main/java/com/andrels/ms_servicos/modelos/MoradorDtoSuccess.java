package com.andrels.ms_servicos.modelos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class MoradorDtoSuccess extends MoradorDto{
     private String id;                         
     private String nome;                                                        
     private String bloco;
     private String apartamento;
 
} 