package com.andrels.ms_servicos.FeignClients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.andrels.ms_servicos.configuracao.FeignClientConfig;
import com.andrels.ms_servicos.modelos.PrestadorDtoSuccess;

@FeignClient(name = "sevico-prestador", url = "http://localhost:8023/", configuration = FeignClientConfig.class)
public interface ClientPrestador {

    @GetMapping("api/prestador/{idPrestador}")
    public PrestadorDtoSuccess getPrestadorPeloId(@PathVariable("idPrestador") String idPrestador);
}
