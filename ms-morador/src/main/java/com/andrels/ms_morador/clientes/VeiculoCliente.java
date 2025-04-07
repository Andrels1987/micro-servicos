package com.andrels.ms_morador.clientes;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.andrels.ms_morador.modelos.ResponseDto;
import com.andrels.ms_morador.modelos.VeiculoDto;

@FeignClient(name = "servico-veiculo", url = "https://vercel-deployment-rouge.vercel.app/api")
public interface VeiculoCliente {
    
    @GetMapping("/veiculo")
    public VeiculoDto getVeiculoPelaPlaca(@RequestParam String placa);

    @GetMapping("/veiculo/{id}")
    public VeiculoDto getVeiculoPeloId(@RequestParam String id);

    @PostMapping("/salvarveiculo")
    public ResponseDto saveVeiculo(@RequestBody VeiculoDto veiculo);
}
