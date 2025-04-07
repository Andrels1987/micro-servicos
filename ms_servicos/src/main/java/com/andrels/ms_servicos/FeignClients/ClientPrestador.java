package com.andrels.ms_servicos.FeignClients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.andrels.ms_servicos.modelos.PrestadorDto;

@FeignClient(name = "sevico-prestador", url = "http://localhost:8023/api")
public interface ClientPrestador {

    @GetMapping("prestador/{idPrestador}")
    public PrestadorDto getPrestadorPeloId(@PathVariable("idPrestador") String idPrestador);
}
