package com.andrels.ms_servicos.modelos;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicoPrestado {
    @Id
    private String id;
    private String idMorador;
    private String idPrestadorDeServico;
    private String observacaoSobreServico;
    private LocalDateTime dataInicioDoServico;
    private LocalDateTime dataEncerramentoDoServico;
    private String tipoDeServico;
}
