package com.condominio.controlers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowire;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.condominio.models.EntregaServico;
import com.condominio.repositorios.RepositorioEntregaServico;

//@CrossOrigin
@RequestMapping("/")
@RestController
public class EntregaServicoControler {

    private RepositorioEntregaServico repositorioEntregaServico;
    

    public EntregaServicoControler(RepositorioEntregaServico repositorioEntregaServico) {
        this.repositorioEntregaServico = repositorioEntregaServico;
    }

    @GetMapping("/entrega_servico")
    public List<EntregaServico> getAllEntregaServico() {
        var entregas = repositorioEntregaServico.findAll();
        return entregas;
    }

    @GetMapping("/entrega_servico/{id}")
    public EntregaServico getEntregaServicoById(@PathVariable("id") String id) {
        Optional<EntregaServico> servicoEncontrado = repositorioEntregaServico.findById(id);
        if (servicoEncontrado.isPresent()) {
            return servicoEncontrado.get();
        }
        return new EntregaServico();
    }

    @PostMapping("/add/servico")
    public String adicionarMorador(@RequestBody EntregaServico entrega) {
        // LocalDateTime date = LocalDateTime.of(entrega.getDataEntregaServico())
        /*
         * EntregaServico servico = new EntregaServico();
         * servico.setNomeMorador(entrega.getNomeMorador());
         * servico.setApartamento(entrega.getApartamento());
         * servico.setBloco(entrega.getBloco());
         * servico.setEntregador(entrega.getEntregador());
         */

        entrega.setDataEntregaServicoEntrada(LocalDateTime.now());
        entrega.setDataEntregaServicoSaida(null);
        EntregaServico servicoadicionado = repositorioEntregaServico.save(entrega);
        if (servicoadicionado.getId() != null) {
            return "entrega adicionado";
        }
        return "Erro ao adicionar entrega";
    }

    @DeleteMapping("delete/servico/{id}")
    public String DeleteEntregador(@PathVariable("id") String id) {
        Optional<EntregaServico> servicoEncontrado = this.repositorioEntregaServico.findById(id);
        if (servicoEncontrado.isEmpty()) {
            return "";
        }
        this.repositorioEntregaServico.deleteById(id);
        return servicoEncontrado.get().getId();
    }

    @PutMapping("update/servico/{id}")
    public EntregaServico UpdateServico(@PathVariable("id") String id, @RequestBody EntregaServico servico) {
        EntregaServico servicoSalvo = this.repositorioEntregaServico.findById(id).get();
        if (servicoSalvo == null) {
            System.out.println("SERVIÇO NÃO ENCONTRADO");
            return new EntregaServico();
        }
        servicoSalvo.setNomeMorador(servico.getNomeMorador());
        servicoSalvo.setBloco(servico.getBloco());
        servicoSalvo.setApartamento(servico.getApartamento());
        servicoSalvo.setDataEntregaServicoSaida(LocalDateTime.now());
        this.repositorioEntregaServico.save(servicoSalvo);
        return servicoSalvo;
    }
    @PutMapping("update/registro/encerramento/{id}")
    public ResponseEntity<String> registrarEncerramento(@PathVariable("id") String id) {
        EntregaServico servicoSalvo = this.repositorioEntregaServico.findById(id).get();
    
        return ResponseEntity.ok().body("tudo certo");
    }
}
