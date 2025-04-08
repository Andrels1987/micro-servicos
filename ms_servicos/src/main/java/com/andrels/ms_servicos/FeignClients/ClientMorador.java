package com.andrels.ms_servicos.FeignClients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.andrels.ms_servicos.configuracao.FeignClientConfig;
import com.andrels.ms_servicos.modelos.MoradorDtoSuccess;

@FeignClient(name = "morador-service", url = "http://localhost:8024/api", configuration = FeignClientConfig.class)
public interface ClientMorador {
    @GetMapping("/moradores/perfil/{id}")
    public MoradorDtoSuccess getMoradorPeloId(@PathVariable("id") String id);
}
