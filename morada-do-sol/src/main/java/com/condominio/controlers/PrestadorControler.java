package com.condominio.controlers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.condominio.models.PrestadorDeServico;
import com.condominio.repositorios.RepositorioDePrestadores;

//PROBLEMAS RESOLVIDOS:
//ADICIONAR IP DA MAQUINA NO MONGO    DB PARA PODER ACESSAR DATABASE
//erro to conectar socket : adicionar ip da maquina
//COLOCAR O ARQUIVO MAIN NA PASTA PRINCIPAL DO PROJETO
//@CrossOrigin(origins = {"http://192.168.1.105:3000/", "http://192.168.1.100:3000", "http://192.168.1.104:3000", "http://localhost:3000"})

@CrossOrigin(origins = "*")
@RequestMapping("api")
@RestController
public class PrestadorControler {

    @Autowired
    private RepositorioDePrestadores repositorioDePrestadores;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/todos-prestadores")
    public List<PrestadorDeServico> getAllPrestadores() {
        List<PrestadorDeServico> prestadores = this.repositorioDePrestadores.findAll();
        return prestadores;
    }
    @GetMapping("/prestadores")
    public List<PrestadorDeServico> getPrestadores() {
        List<PrestadorDeServico> prestadores = this.repositorioDePrestadores.findAllActivePrestadores();
        return prestadores;
    }

    @GetMapping("/prestador/{id}")
    public PrestadorDeServico getEntregadorPeloId(@PathVariable("id") String id) {
        Optional<PrestadorDeServico> prestador = this.repositorioDePrestadores.findById(id);

        if(prestador.isPresent())
            return prestador.get();
        
        return new PrestadorDeServico();
    }

    @PostMapping("/add/prestador")
    public PrestadorDeServico AddEntregador(@RequestBody PrestadorDeServico prestador) {

        LocalDateTime date = LocalDateTime.now();
        prestador.setCriadoEm(date);
        PrestadorDeServico entregadorSalvo = this.repositorioDePrestadores.save(prestador);
        return entregadorSalvo;

    }

    // @CrossOrigin(origins = {"http://192.168.1.105:3000/",
    // "http://192.168.1.100:3000", "http://192.168.1.104:3000",
    // "http://localhost:3000"}
    @DeleteMapping("/delete/prestador/{id}")
    public String DeleteEntregador(@PathVariable("id") String id) {
       
            Optional<PrestadorDeServico> prestadorEncontrado = this.repositorioDePrestadores.findById(id);
            
            this.repositorioDePrestadores.deleteById(id);
            return prestadorEncontrado.get().getId();
       
    }

    @PutMapping("/update/prestador/{id}")
    public PrestadorDeServico updateEntregador(@PathVariable("id") String id,
            @RequestBody PrestadorDeServico prestador) {

                System.out.println();
        System.out.println();
        System.out.println("Prestador : " + prestador);
        System.out.println();
        PrestadorDeServico prestadorSalvo = this.repositorioDePrestadores.findById(id).get();
        if (prestadorSalvo == null) {
            System.out.println("entregador NÃO ENCONTRADO");
            return new PrestadorDeServico();    
        }
        /* modelMapper.addMappings(new PropertyMap<PrestadorDeServico, PrestadorDeServico>() {
            @Override
            protected void configure() {
                skip(destination.getId());
            }
        }); */
        prestador.setAtualizadoEm(LocalDateTime.now());
        modelMapper.map(prestador, prestadorSalvo);       
        
        var e = this.repositorioDePrestadores.save(prestadorSalvo);
        return e;
    }
}
