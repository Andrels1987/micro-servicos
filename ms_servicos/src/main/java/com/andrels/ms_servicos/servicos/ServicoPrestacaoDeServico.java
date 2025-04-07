package com.andrels.ms_servicos.servicos;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.andrels.ms_servicos.modelos.ServicoPrestado;
import com.andrels.ms_servicos.modelos.ServicoPrestadoDto;

public interface ServicoPrestacaoDeServico {
    public List<ServicoPrestadoDto> getTodosServicos();
    public ServicoPrestadoDto getServicoPeloId(String idPrestacaoServico);
    public List<ServicoPrestadoDto> getServicosPeloPrestadorDeServico(String idPrestador);
    public List<ServicoPrestadoDto> getServicoPeloMorador(String idMorador);
    public String addPrestacaoDeServico(ServicoPrestado servicoPrestado);
    public String deletarPrestacaoDeServico(String IdServicoPrestado);
    public String atualizarPrestacaoDeServico(String IdServicoPrestado, ServicoPrestadoDto servicoPrestadoDto);
    public List<ServicoPrestado> getServicosPrestadoPelaData(LocalDateTime data);    
    public String registrarEncerramentoDoServico(@PathVariable("id") String id);
}
