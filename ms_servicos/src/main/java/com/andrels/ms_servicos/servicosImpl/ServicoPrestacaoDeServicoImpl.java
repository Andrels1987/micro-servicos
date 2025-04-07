package com.andrels.ms_servicos.servicosImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.andrels.ms_servicos.FeignClients.ClientMorador;
import com.andrels.ms_servicos.FeignClients.ClientPrestador;
import com.andrels.ms_servicos.modelos.MoradorDto;
import com.andrels.ms_servicos.modelos.PrestadorDto;
import com.andrels.ms_servicos.modelos.ServicoPrestado;
import com.andrels.ms_servicos.modelos.ServicoPrestadoDto;
import com.andrels.ms_servicos.repositorios.RepositorioServicoPrestados;
import com.andrels.ms_servicos.servicos.ServicoPrestacaoDeServico;

@Service
public class ServicoPrestacaoDeServicoImpl implements ServicoPrestacaoDeServico {

    @Autowired
    ModelMapper modelMapper;
    @Autowired
    RepositorioServicoPrestados repositorioServicosPrestados;
    @Autowired
    private ClientMorador clienteMorador;
    @Autowired
    private ClientPrestador clientePrestador;

    @Override
    public List<ServicoPrestadoDto> getTodosServicos() {
        List<ServicoPrestadoDto> servicosPrestadoDtos = new ArrayList<>();
        List<ServicoPrestado> servicos = repositorioServicosPrestados.findAll();
        if (!servicos.isEmpty()) {
            for (ServicoPrestado servico : servicos) {

                ServicoPrestadoDto sDto = new ServicoPrestadoDto();
                // BUSCANDO MORADOR
                addInformacaoMorador(servico, sDto);
                // BUSCANDO PRESTADOR DE SERVICO
                addInformacaoPrestador(servico, sDto);
                
                // INFORMAÇÃO DO SERVICO
                addInformacaoServico(servico, sDto);
                servicosPrestadoDtos.add(sDto);
            }
           
            return servicosPrestadoDtos;
        }
        return List.of();
    }

    @Override
    public ServicoPrestadoDto getServicoPeloId(String idPrestacaoServico) {
        Optional<ServicoPrestado> servico = repositorioServicosPrestados.findById(idPrestacaoServico);
        if (servico.isPresent()) {
            ServicoPrestadoDto sDto = new ServicoPrestadoDto();
            // BUSCANDO MORADOR
            addInformacaoMorador(servico.get(), sDto);
            // BUSCANDO PRESTADOR DE SERVICO
            addInformacaoPrestador(servico.get(), sDto);
            
            addInformacaoServico(servico.get(), sDto);

            return sDto;
        }
        return new ServicoPrestadoDto();
    }

    // TODOS OS SERVIÇOOS PRESTADOS PELO PRESTADOR ESPECIFICO
    @Override
    public List<ServicoPrestadoDto> getServicosPeloPrestadorDeServico(String idPrestador) {
        List<ServicoPrestado> servicos = repositorioServicosPrestados.getServicoPrestadoPeloIdDoPrestador(idPrestador);
        
        List<ServicoPrestadoDto> servicosPrestadoDtos = new ArrayList<>();
        if (!servicos.isEmpty()) {
            for (ServicoPrestado servico : servicos) {
                ServicoPrestadoDto sDto = new ServicoPrestadoDto();
                 // BUSCANDO MORADOR
                 addInformacaoMorador(servico, sDto);
                 // BUSCANDO PRESTADOR DE SERVICO
                 addInformacaoPrestador(servico, sDto);
                 
                 // INFORMAÇÃO DO SERVICO
                 addInformacaoServico(servico, sDto);
                 servicosPrestadoDtos.add(sDto);
            }
            return servicosPrestadoDtos;
        }
        return List.of();
    }

    // TODOS OS SERVIÇOOS PRESTADOS PELO MORADOR ESPECIFICO
    @Override
    public List<ServicoPrestadoDto> getServicoPeloMorador(String idMorador) {

        List<ServicoPrestado> servicos = repositorioServicosPrestados.getServicoPrestadoPeloIdDoMorador(idMorador);
        List<ServicoPrestadoDto> servicosPrestadoDtos = new ArrayList<>();
        if (!servicos.isEmpty()) {
            for (ServicoPrestado servico : servicos) {
                ServicoPrestadoDto sDto = new ServicoPrestadoDto();
                 // BUSCANDO MORADOR
                 addInformacaoMorador(servico, sDto);
                 // BUSCANDO PRESTADOR DE SERVICO
                 addInformacaoPrestador(servico, sDto);
                 
                 // INFORMAÇÃO DO SERVICO
                 addInformacaoServico(servico, sDto);
                 servicosPrestadoDtos.add(sDto);
            }
            return servicosPrestadoDtos;
        }
        return List.of();
    }

    @Override
    public String addPrestacaoDeServico(ServicoPrestado servicoPrestado) {
        ServicoPrestado servico = new ServicoPrestado();
        PrestadorDto prestador = clientePrestador.getPrestadorPeloId(servicoPrestado.getIdPrestadorDeServico());
        MoradorDto morador = clienteMorador.getMoradorPeloId(servicoPrestado.getIdMorador());
    
        if (morador != null && prestador != null) {
            servicoPrestado.setDataInicioDoServico(LocalDateTime.now());
            servicoPrestado.setDataEncerramentoDoServico(null);
           servico = this.repositorioServicosPrestados.save(servicoPrestado);
            return servico.getId();
        }
        
        return "Serviço não pode ser adicionado por alta de informações";
    }

    @Override
    public String deletarPrestacaoDeServico(String IdServicoPrestado) {
        Optional<ServicoPrestado> servico = repositorioServicosPrestados.findById(IdServicoPrestado);
        if (!servico.isPresent()) {
            return "Nenhum servico encontrado";
        }
        repositorioServicosPrestados.delete(servico.get());
        return "Servico excuido com sucesso";
    }

    @Override
    public String atualizarPrestacaoDeServico(String IdServicoPrestado, ServicoPrestadoDto servicoPrestadoDto) {
        Optional<ServicoPrestado> servico = repositorioServicosPrestados.findById(IdServicoPrestado);
        if (!servico.isPresent()) {
            return "Nenhum servico encontrado";
        }
        modelMapper.addMappings(new PropertyMap<ServicoPrestadoDto, ServicoPrestado>() {
            @Override
            protected void configure() {
                skip(destination.getId());
            }
        });
        ServicoPrestado updatedServico = servico.get();
        modelMapper.map(servicoPrestadoDto, updatedServico);

        this.repositorioServicosPrestados.save(updatedServico);
        return updatedServico.getId();
    }

    // TODOS OS SERVICOS PRESTADOS NA DATA ESPECIFICA
    @Override
    public List<ServicoPrestado> getServicosPrestadoPelaData(LocalDateTime data) {
        List<ServicoPrestado> servicosPrestados = repositorioServicosPrestados.getServicosPelaData(data);
        return List.of();
    }

    public void addInformacaoMorador(ServicoPrestado servico, ServicoPrestadoDto servicoPrestadoDto) {
        // BUSCANDO MORADOR
        MoradorDto morador = clienteMorador.getMoradorPeloId(servico.getIdMorador());
        if (morador != null) {
            servicoPrestadoDto.setIdMorador(morador.id());
            servicoPrestadoDto.setNomeMorador(morador.nome());
            servicoPrestadoDto.setBloco(morador.bloco());
            servicoPrestadoDto.setApartamento(morador.apartamento());
        }
    }

    public void addInformacaoPrestador(ServicoPrestado servico, ServicoPrestadoDto servicoPrestadoDto) {
        PrestadorDto prestador = clientePrestador.getPrestadorPeloId(servico.getIdPrestadorDeServico());
        if (prestador != null) {
            servicoPrestadoDto.setIdPrestadorDeServico(prestador.id());
            servicoPrestadoDto.setNomePrestador(prestador.nome());
        }
    }

    public void addInformacaoServico(ServicoPrestado servico, ServicoPrestadoDto servicoPrestadoDto) {


        servicoPrestadoDto.setId(servico.getId());
        servicoPrestadoDto.setObservacaoSobreServico(servico.getObservacaoSobreServico());
        servicoPrestadoDto.setDataInicioDoServico(servico.getDataInicioDoServico());
        servicoPrestadoDto.setDataEncerramentoDoServico(servico.getDataEncerramentoDoServico());
        servicoPrestadoDto.setTipoDeServico(servico.getTipoDeServico());
    }

    public String registrarEncerramentoDoServico(@PathVariable("id") String id) {
        ServicoPrestado servicoSalvo = this.repositorioServicosPrestados.findById(id).get();
        if (servicoSalvo == null) {
            System.out.println("SERVIÇO NÃO ENCONTRADO");
            return "SERVIÇO NÃO ENCONTRADO";
        }
        servicoSalvo.setDataEncerramentoDoServico(LocalDateTime.now());;
        this.repositorioServicosPrestados.save(servicoSalvo);
        return servicoSalvo.getId();
    }
}
