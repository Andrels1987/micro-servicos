package com.andrels.ms_morador.controles;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andrels.ms_morador.clientes.VeiculoCliente;
import com.andrels.ms_morador.exception.MoradorNotFoundException;
import com.andrels.ms_morador.modelos.DependenteDto;
import com.andrels.ms_morador.modelos.Morador;
import com.andrels.ms_morador.modelos.MoradorDto;
import com.andrels.ms_morador.modelos.ResponseDto;
import com.andrels.ms_morador.modelos.VeiculoDto;
import com.andrels.ms_morador.serviceImpl.ServicoMoradorImpl;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin(origins = "http://localhost:3000, http://192.168.1.111:3000")
@RestController
@RequestMapping("api")
public class ControleMorador {

    @Autowired
    ServicoMoradorImpl servicoMoradorImpl;

    @Autowired
    VeiculoCliente veiculoCliente;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/moradores")
    public ResponseEntity<List<Morador>> getAllMoradores() {
        List<Morador> moradores = servicoMoradorImpl.todosMoradores();

        return ResponseEntity.ok().body(moradores);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/moradores/perfil/{id}")
    public ResponseEntity<MoradorDto> getMoradorById(@PathVariable("id") String id) {
        MoradorDto morador = servicoMoradorImpl.getMoradorPeloId(id);
        return ResponseEntity.ok().body(morador);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/morador/documento/{documento}")
    public ResponseEntity<MoradorDto> getMoradorPeloDocumento(@PathVariable("documento") String documento) {
        MoradorDto morador = servicoMoradorImpl.buscarMoradorPeloDocumento(documento);
        return ResponseEntity.ok().body(morador);
    }

    @GetMapping("/morador/veiculo/placa/{placa}")
    public ResponseEntity<Morador> getMoradorPelaPlacaDoVeiculo(@PathVariable("placa") String placa) {
        Morador morador = servicoMoradorImpl.getProprietarioPelaPlacaDoVeiculo(placa);

        return ResponseEntity.ok().body(morador);
    }

    @GetMapping("/morador/veiculo/{id}")
    public ResponseEntity<Morador> getMoradorPeloIdDoVeiculo(@PathVariable("id") String id) {
        Morador morador = servicoMoradorImpl.getProprietarioPeloIdDoVeiculo(id);

        return ResponseEntity.ok().body(morador);
    }

    @PostMapping("morador/add")
    public ResponseEntity<ResponseDto> addMorador(@RequestBody Morador morador) {
        Morador newMorador = new Morador();

        newMorador.setNome(morador.getNome());
        newMorador.setSobrenome(morador.getSobrenome());
        newMorador.setApartamento(morador.getApartamento());
        newMorador.setBloco(morador.getBloco());
        newMorador.setFoto(morador.getFoto());
        newMorador.setTelefone(morador.getTelefone());
        newMorador.setCriadoEm(LocalDateTime.now());
        newMorador.setDocumento(morador.getDocumento());

        newMorador = servicoMoradorImpl.saveMorador(newMorador);
        if (newMorador != null) {
            ResponseDto response = new ResponseDto(newMorador.getId());
            return ResponseEntity.ok().body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDto("Morador não salvo"));

    }

    @DeleteMapping("morador/delete/{id}")
    public ResponseEntity<ResponseDto> deleteMorador(@PathVariable("id") String _id) throws MoradorNotFoundException {
        System.out.println("Chegou em deleteMorador()");
        try {
            String resposta = servicoMoradorImpl.excluirMorador(_id);
            return ResponseEntity.ok().body(new ResponseDto(resposta));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDto(e.getMessage()));
        }

    }

    @PutMapping("update/morador/{id}")
    public ResponseEntity<ResponseDto>  UpdateMorador(@PathVariable("id") String id, @RequestBody Morador morador) throws MoradorNotFoundException{
        
        
        try {            
            String response = servicoMoradorImpl.updateMorador(id, morador);
            return ResponseEntity.ok().body(new ResponseDto(response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDto(e.getMessage()));
        }
       
        
    }

    @PutMapping("adicionardependente/morador/{id}")
    public ResponseEntity<ResponseDto> adicionarDependente(@PathVariable("id") String id,
            @RequestBody DependenteDto dependente) {

        var response = servicoMoradorImpl.adicionarDependenteAoMorador(id, dependente);
        return ResponseEntity.ok().body(new ResponseDto(response));
    }

    @GetMapping("morador/veiculos/{idmorador}")
    public ResponseEntity<List<VeiculoDto>> getVeiculosDoMorador(@PathVariable("idmorador") String idmorador) {
        List<VeiculoDto> veiculosDoMorador = servicoMoradorImpl.getVeiculoPeloMorador(idmorador);
        if (!veiculosDoMorador.isEmpty()) {
            return ResponseEntity.ok().body(veiculosDoMorador);
        }
        return ResponseEntity.badRequest().body(List.of());
    }
}
