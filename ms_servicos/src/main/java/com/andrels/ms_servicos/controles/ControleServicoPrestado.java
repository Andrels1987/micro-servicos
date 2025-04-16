package com.andrels.ms_servicos.controles;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andrels.ms_servicos.modelos.ResponseId;
import com.andrels.ms_servicos.modelos.ServicoPrestado;
import com.andrels.ms_servicos.modelos.ServicoPrestadoDto;
import com.andrels.ms_servicos.servicosImpl.ServicoPrestacaoDeServicoImpl;

@CrossOrigin(origins = "http://localhost:3000, http://192.168.1.111:3000")
@RequestMapping("/api")
@RestController
public class ControleServicoPrestado {
    

    @Autowired
    ServicoPrestacaoDeServicoImpl servicoPrestacaoDeServicoImpl;
    
    @GetMapping("/servicosprestados")
    public ResponseEntity<List<ServicoPrestadoDto>> getServicosPrestados(){
        List<ServicoPrestadoDto> servicos = servicoPrestacaoDeServicoImpl.getTodosServicos();
        return ResponseEntity.ok().body(servicos);
    }
    @GetMapping("/servicosprestados/{id}")
    public ResponseEntity<ServicoPrestadoDto> getServicosPrestadosPeloId(@PathVariable("id") String id){
        
        ServicoPrestadoDto servico = servicoPrestacaoDeServicoImpl.getServicoPeloId(id);
        return ResponseEntity.ok().body(servico);
        
    }
    @GetMapping("/servicosprestados/morador/{id}")
    public ResponseEntity<List<ServicoPrestadoDto>> getServicosPrestadosPeloIdMorador(@PathVariable("id") String id){
        List<ServicoPrestadoDto> servicos = servicoPrestacaoDeServicoImpl.getServicoPeloMorador(id);
        return ResponseEntity.ok().body(servicos);
    }
    @GetMapping("/servicosprestados/prestador/{id}")
    public ResponseEntity<List<ServicoPrestadoDto>> getServicosPrestadosPeloIdPrestador(@PathVariable("id") String id){
        List<ServicoPrestadoDto> servicos = servicoPrestacaoDeServicoImpl.getServicosPeloPrestadorDeServico(id);
        return ResponseEntity.ok().body(servicos);
    }
    @PostMapping("servicosprestados/add")
    public ResponseEntity<String> salvarServicosPrestados(@RequestBody ServicoPrestado servicoPrestadoDto){
        String resposta = servicoPrestacaoDeServicoImpl.addPrestacaoDeServico(servicoPrestadoDto);
        return ResponseEntity.ok().body(resposta);
    }
    @PutMapping("update/registro/encerramento/{id}")
    public ResponseEntity<ResponseId> registrarEncerramento(@PathVariable("id") String id) {
        var resposta = this.servicoPrestacaoDeServicoImpl.registrarEncerramentoDoServico(id);
    
        return ResponseEntity.ok().body(new ResponseId(resposta));
    }
}
