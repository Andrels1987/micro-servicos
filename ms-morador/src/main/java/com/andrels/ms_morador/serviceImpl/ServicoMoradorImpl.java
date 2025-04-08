package com.andrels.ms_morador.serviceImpl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.andrels.ms_morador.clientes.VeiculoCliente;
import com.andrels.ms_morador.modelos.DependenteDto;
import com.andrels.ms_morador.modelos.DependenteInfo;
import com.andrels.ms_morador.modelos.Morador;
import com.andrels.ms_morador.modelos.MoradorDto;
import com.andrels.ms_morador.modelos.VeiculoDto;
import com.andrels.ms_morador.repositorio.RepositorioMorador;
import com.andrels.ms_morador.servicos.ServicoMorador;

@Service
public class ServicoMoradorImpl implements ServicoMorador {

    @Autowired
    private RepositorioMorador repositorioMorador;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    VeiculoCliente veiculoCliente;

    @Override
    public List<Morador> todosMoradores() {
        List<Morador> moradores = repositorioMorador.findAll();
        if (!moradores.isEmpty()) {
            return moradores;
        }
        return List.of();
    }

    @Override
    public MoradorDto getMoradorPeloId(String id) {
        Optional<Morador> moradorEncontrado = repositorioMorador.findById(id);
       
        if (moradorEncontrado.isPresent()) {
            MoradorDto dto = new MoradorDto();
            dto.setId(moradorEncontrado.get().getId());
            dto.setNome(moradorEncontrado.get().getNome());
            dto.setSobrenome(moradorEncontrado.get().getSobrenome());
            dto.setApartamento(moradorEncontrado.get().getApartamento());
            dto.setBloco(moradorEncontrado.get().getBloco());
            dto.setTelefone(moradorEncontrado.get().getTelefone());
            dto.setFoto(moradorEncontrado.get().getFoto());
            dto.setDocumento(moradorEncontrado.get().getDocumento());
            dto.setCriadoEm(moradorEncontrado.get().getCriadoEm());

            // morador.setVeiculos(moradorEncontrado.get().getPlacaVeiculos());

            if (moradorEncontrado.get().getVeiculos() != null) {

                List<VeiculoDto> vecs = new ArrayList<>();
                for (var v : moradorEncontrado.get().getVeiculos()) {
                    VeiculoDto veiculo = veiculoCliente.getVeiculoPeloId(v);
                    vecs.add(veiculo);
                }
                dto.setVeiculos(vecs);
            }

            
            if (moradorEncontrado.get().getDependentes() != null) {
                List<DependenteInfo> dependentes = new ArrayList<>();
                for (var i : moradorEncontrado.get().getDependentes()) {
                    Morador m = repositorioMorador.findById(i.get_id()).get();

                    DependenteInfo dependenteInfo = new DependenteInfo();
                    dependenteInfo.setParentesco(i.getParentesco());
                    dependenteInfo.set_id(m.getId());
                    dependenteInfo.setNome(m.getNome());
                    dependenteInfo.setSobrenome(m.getSobrenome());
                    dependentes.add(dependenteInfo);
                }
                dto.setDependentes(dependentes);
            }

            return dto;
        }
        
        return new MoradorDto();
    }

    @Override
    public Morador saveMorador(Morador morador) {
        return repositorioMorador.save(morador);
    }

    @Override
    public List<VeiculoDto> getVeiculoPeloMorador(String idMorador) {
        List<VeiculoDto> veiculos = new ArrayList<>();
        Morador morador = repositorioMorador.findById(idMorador).orElse(new Morador());
        if (!morador.getVeiculos().isEmpty()) {
            List<String> ids = morador.getVeiculos();
            for (String id : ids) {
                var veiculo = veiculoCliente.getVeiculoPeloId(id);
                if (veiculo.getErr() == null) {
                    veiculos.add(veiculo);
                }
            }
        }

        return veiculos;
    }

    @Override
    public Morador getMoradorPeloCpf(String cpf) {
        return repositorioMorador.getMoradorPeloCpf(cpf);
    }

    @Override
    public String excluirMorador(String _id) {
        Optional<Morador> moradorEncontrado = this.repositorioMorador.findById(_id);
        if (moradorEncontrado.isEmpty()) {
            return "Morador com esse id não encontrado";
        }
        this.repositorioMorador.deleteById(_id);
        return "Morador com id: " + moradorEncontrado.get().getId() + " deletado com sucesso";
    }

    @Override
    public Morador getProprietarioPelaPlacaDoVeiculo(String placa) {// Retorna MoradorDTO
        Morador morador = repositorioMorador.getMoradorPelaPlacaDoVeiculo(placa);
        if (morador != null) {
            return morador;
        }
        return new Morador();
    }

    @Override
    public String updateMorador(String _id, Morador updatedmorador) {
        Optional<Morador> optionalMorador = repositorioMorador.findById(_id);
        if (!optionalMorador.isPresent()) {
            System.out.println("Morador NÃO ENCONTRADO");
            return "";
        }

        Morador moradorSalvo = optionalMorador.get();
        // updatedmorador.setId(moradorSalvo.getId());
        if (updatedmorador.getVeiculos() != null) {
            Set<String> veiculosSet = new HashSet<>(updatedmorador.getVeiculos());
            if (moradorSalvo.getVeiculos() != null) {
                moradorSalvo.getVeiculos().stream()
                        .filter(id -> !veiculosSet.contains(id))
                        .forEach(updatedmorador.getVeiculos()::add);
            }
        }

        List<DependenteDto> dependentes = updatedmorador.getDependentes();
        System.out.println();
        System.out.println(dependentes);
        System.out.println();
        if (dependentes != null && !dependentes.isEmpty()) { // Fixed the condition
            Set<String> existingIds = dependentes.stream()
                    .map(DependenteDto::get_id)
                    .collect(Collectors.toSet());
            System.out.println();
            System.out.println("IDS : " + existingIds);
            System.out.println();

            List<DependenteDto> newDependentes = moradorSalvo.getDependentes() != null
                    ? moradorSalvo.getDependentes().stream()
                            .filter(dep -> !existingIds.contains(dep.get_id()))
                            .collect(Collectors.toList())
                    : new ArrayList<>();

                    System.out.println();
            System.out.println("newDependentes : " + newDependentes);
            System.out.println();
            dependentes.addAll(newDependentes);
        }

        modelMapper.map(updatedmorador, moradorSalvo);

        this.repositorioMorador.save(moradorSalvo);
        return moradorSalvo.getId();
    }

    @Override
    public Morador getProprietarioPeloIdDoVeiculo(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getProprietarioPeloIdDoVeiculo'");
    }

    public List<VeiculoDto> getVeiculos() {

        return null;
    }

    @Override
    public MoradorDto buscarMoradorPeloDocumento(String documento) {
        MoradorDto dto = new MoradorDto();
        Morador moradorEncontrado = repositorioMorador.getMoradorPeloNumeroDoDocumento(documento);

        if (moradorEncontrado != null) {
            dto.setId(moradorEncontrado.getId());
            dto.setNome(moradorEncontrado.getNome());
            dto.setSobrenome(moradorEncontrado.getSobrenome());
            dto.setFoto(moradorEncontrado.getFoto());

            return dto;
        }
        return new MoradorDto();
    }

    @Override
    public String adicionarDependenteAoMorador(String _id, DependenteDto dependente) {

        Optional<Morador> retorno = repositorioMorador.findById(_id);
        if (retorno.isPresent()) {
            Morador morador = retorno.get();
            List<DependenteDto> dependentes = morador.getDependentes();
            if (dependentes == null) {
                dependentes = new ArrayList<>();
            }
            dependentes.add(dependente);
            morador.setDependentes(dependentes);
            Morador salvo = repositorioMorador.save(morador);
            return "Dependente de id=" + dependente.get_id() + " associado ao morador de id=" + salvo.getId()
   
                    + " com sucesso";
        }
        return "Não foi possivel associar esse dependente ao morador de id=" + _id;
    }
}
