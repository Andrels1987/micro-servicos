package com.andrels.ms_morador.servicos;

import java.util.List;

import com.andrels.ms_morador.modelos.DependenteDto;
import com.andrels.ms_morador.modelos.Morador;
import com.andrels.ms_morador.modelos.MoradorDto;
import com.andrels.ms_morador.modelos.VeiculoDto;

public interface ServicoMorador {
    public List<Morador> todosMoradores();
    public MoradorDto getMoradorPeloId(String id);
    public MoradorDto buscarMoradorPeloDocumento(String documento);
    public Morador saveMorador(Morador morador);
    public List<VeiculoDto> getVeiculoPeloMorador(String idMorador);
    public Morador getMoradorPeloCpf(String cpf);
    public Morador getProprietarioPelaPlacaDoVeiculo(String placa);
    public Morador getProprietarioPeloIdDoVeiculo(String id);
    public String excluirMorador(String _id);
    public String updateMorador(String _id, Morador morador);
    public String adicionarDependenteAoMorador(String _id, DependenteDto dependente);
}
