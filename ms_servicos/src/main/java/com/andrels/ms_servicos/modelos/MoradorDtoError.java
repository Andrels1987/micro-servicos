package com.andrels.ms_servicos.modelos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoradorDtoError extends MoradorDto{
     private String message;
} 