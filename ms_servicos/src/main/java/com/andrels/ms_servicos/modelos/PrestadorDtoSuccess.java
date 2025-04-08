package com.andrels.ms_servicos.modelos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class PrestadorDtoSuccess extends PrestadorDto{
    private String id; 
    private String nome;  
    
}
