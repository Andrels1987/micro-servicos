package com.condominio.controlers;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.condominio.models.Dependente;
import com.condominio.models.MoradorDTO;
import com.condominio.models.Moradores;
import com.condominio.models.Veiculo;
import com.condominio.repositorios.RepositorioDeMoradores;
import com.condominio.repositorios.RepositorioDeVeiculos;

@RequestMapping("/api")
@RestController
public class MoradorControler {

    private RepositorioDeMoradores repositorioDeMoradores;
    @Autowired
    private RepositorioDeVeiculos repositorioDeVeiculos;

    public MoradorControler(RepositorioDeMoradores repositorioDeMoradores) {
        this.repositorioDeMoradores = repositorioDeMoradores;
    }

    @GetMapping("/moradores")
    public List<Moradores> getAllMoradores() {
        List<Moradores> moradores = repositorioDeMoradores.findAll();

        return moradores;
    }

    @GetMapping("/moradores/perfil/{id}")
    public Moradores getMoradorById(@PathVariable("id") String id) {
        if (id == null) {
            return new Moradores();
        }
        Optional<Moradores> moradorEncontrado = repositorioDeMoradores.findById(id);
        if (moradorEncontrado.isPresent()) {
            return moradorEncontrado.get();
        }
        return new Moradores();
    }

    @GetMapping("/moradores/proprietario/{id_veiculo}")
    public List<Moradores> getProprietarioPeloIdDoVeiculo(@PathVariable("id_veiculo") String id_veiculo) {
        List<Moradores> proprietarios = new ArrayList<>();
        List<Moradores> moradores = repositorioDeMoradores.findAll();
        if (moradores != null) {
            moradores.forEach(m -> {
                List<Veiculo> veiculos = m.getVeiculo();
                if (veiculos != null) {
                    veiculos.forEach(v -> {
                        if (v.getId().equals(id_veiculo)) {
                            proprietarios.add(m);
                        }
                    });
                }
            });
        }
        // reduzir tamanho do dados de retorno
        return proprietarios;
    }

    @PostMapping("/add/morador")
    public String adicionarMorador(@RequestBody MoradorDTO moradordto) {

        Moradores morador = new Moradores();
        morador.setNome(moradordto.nome());
        morador.setSobrenome(moradordto.sobrenome());
        morador.setApartamento(moradordto.apartamento());
        morador.setBloco(moradordto.bloco());
        morador.setTelefone(moradordto.telefone());
        /*
         * morador.setDependentes(moradordto.listaDependentes());
         * morador.setVeiculo(moradordto.listaVeiculos());
         */
        morador.setFoto(moradordto.foto());

        List<Dependente> dependentesSalvos = new ArrayList<>();
        List<Veiculo> veiculosSalvos = new ArrayList<>();

        List<Dependente> dependentes = moradordto.listaDependentes();
        List<Veiculo> veiculos = moradordto.listaVeiculos();

        dependentes.forEach(dependente -> {

            Moradores moradorDependente = repositorioDeMoradores.getMoradorByNome(dependente.getDependente().getNome());
            // SE NÃO EXISTIR NENHUM REGISTRO COM O NOME DO DEPENDENTE
            // NO BANCO, ENTAO ELE É SALVO
            if (moradorDependente == null) {
                Moradores salvo = this.repositorioDeMoradores.save(dependente.getDependente());
                if (salvo != null) {
                    Dependente d0 = new Dependente();
                    d0.setParentesco(dependente.getParentesco());
                    d0.setDependente(dependente.getDependente());

                    dependentesSalvos.add(d0);
                }
            }

        });
        veiculos.forEach(veiculo -> {

            Veiculo m = repositorioDeVeiculos.getVeiculoById(veiculo.getPlaca());
            // SE NÃO EXISTIR NENHUM REGISTRO COM O A PLACA DO VEICULO
            // NO BANCO, ENTAO ELE É SALVO
            if (m == null) {
                Veiculo salvo = this.repositorioDeVeiculos.save(veiculo);
                if (salvo != null) {
                    veiculosSalvos.add(salvo);
                }
            }
        });

        morador.setDependentes(dependentesSalvos);
        morador.setVeiculo(veiculosSalvos);
        System.out.println();
        System.out.println();
        System.out.println(morador);
        Moradores moradoradicionado = repositorioDeMoradores.save(morador);
        if (moradoradicionado.getId() != null) {
            return "morador adicionado";
        }
        return "Erro ao adicionar morador";
    }

    @DeleteMapping("delete/morador/{id}")
    public String DeleteMorador(@PathVariable("id") String id) {

        Optional<Moradores> moradorEncontrado = this.repositorioDeMoradores.findById(id);
        if (moradorEncontrado.isEmpty()) {
            return "";
        }
        this.repositorioDeMoradores.deleteById(id);
        return moradorEncontrado.get().getId();
    }

    @PutMapping("update/morador/{id}")
    public Moradores UpdateMorador(@PathVariable("id") String id, @RequestBody Moradores morador) {
        Moradores moradorSalvo = this.repositorioDeMoradores.findById(id).get();
        if (moradorSalvo == null) {
            System.out.println("entregador NÃO ENCONTRADO");
            return new Moradores();
        }
        moradorSalvo.setNome(morador.getNome());
        moradorSalvo.setSobrenome(morador.getSobrenome());
        this.repositorioDeMoradores.save(moradorSalvo);
        return moradorSalvo;
    }
}
