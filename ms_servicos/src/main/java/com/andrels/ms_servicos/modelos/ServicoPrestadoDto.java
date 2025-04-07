package com.andrels.ms_servicos.modelos;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicoPrestadoDto {
    private String id;
    private String idMorador;
    private String nomeMorador;
    private String bloco;
    private String apartamento;
    private String idPrestadorDeServico;
    private String nomePrestador;
    private String observacaoSobreServico;
    private LocalDateTime dataInicioDoServico;
    private LocalDateTime dataEncerramentoDoServico;
    private String tipoDeServico;

    public ServicoPrestadoDto(
            String idMorador,
            String idPrestadorDeServico,
            String observacaoSobreServico,
            String tipoDeServico) {

    }
}
