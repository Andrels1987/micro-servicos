package com.andrels.ms_servicos.FeignClients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.andrels.ms_servicos.modelos.MoradorDto;

@FeignClient(name = "morador-service", url = "http://localhost:8024/api")
public interface ClientMorador {
    @GetMapping("moradores/perfil/{id}")
    public MoradorDto getMoradorPeloId(@PathVariable("id") String id);
}
