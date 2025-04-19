import React, { useCallback,  useEffect, useState } from 'react';
import {  useLazyGetServicosPrestadosQuery } from '../../features/api/servicos/apiServicosPrestados';
import { format } from 'date-fns';
import { Link } from 'react-router';


import Loading from '../../Loading';

const Registros = () => {

  const [ fetchServicosrestados, {data: todosOsRegistros, isLoading }] = useLazyGetServicosPrestadosQuery( );

  const [modoBusca, setModoBusca] = useState('data');
  const [registros, setRegistros] = useState([]);
  const [filtroData, setFiltroData] = useState('');
  const [filtroBlocoApt, setFiltroBlocoApt] = useState({ bloco: '', apartamento: '' });

  // Atualiza a lista de registros assim que a API retornar
  useEffect(() => {

      fetchServicosrestados();
    
  }, [fetchServicosrestados]);

  useEffect(() => {
    if(todosOsRegistros){
      setRegistros(todosOsRegistros)
    }
  }, [todosOsRegistros]);
  
  
  console.log(todosOsRegistros)
  // Função de filtro (por data ou bloco/apartamento)
  const handleSearch = useCallback(() => {
    let filtrados = [];

    if (modoBusca === 'data') {
      filtrados = todosOsRegistros.filter(registro =>
        registro.dataInicioDoServico?.includes(filtroData)
      );
    } else {
      filtrados = todosOsRegistros.filter(registro =>
        registro.morador?.apartamento?.trim().includes(filtroBlocoApt.apartamento.trim()) &&
        registro.morador?.bloco?.trim().includes(filtroBlocoApt.bloco.trim())
      );
    }

    setRegistros(filtrados.length > 0 ? filtrados : todosOsRegistros);
  }, [modoBusca, filtroData, filtroBlocoApt, todosOsRegistros]);

  useEffect(() => {
    if (registros.length > 0) handleSearch();
  }, [handleSearch, registros.length]);

  // Helpers
  const limitarNome = (nome) => nome?.split(' ')[0] || '';
  const formatarData = (data) => format(new Date(data), 'dd-MM-yyyy');

  return (
    <div style={{ color: 'white' }}>
    {isLoading ? <Loading /> : (
      <>
      <div className="modo-busca">
        <label htmlFor="modo">Modo de busca</label>
        <select
          id="modo"
          value={modoBusca}
          onChange={(e) => setModoBusca(e.target.value)}
        >
          <option value="data">Data</option>
          <option value="bloco-apartamento">Apartamento e bloco</option>
        </select>
      </div>

      <form>
        {modoBusca === 'data' ? (
          <input
            type="date"
            placeholder="Data do serviço"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Apartamento"
              value={filtroBlocoApt.apartamento}
              onChange={(e) => setFiltroBlocoApt({ ...filtroBlocoApt, apartamento: e.target.value })}
            />
            <input
              type="text"
              placeholder="Bloco"
              value={filtroBlocoApt.bloco}
              onChange={(e) => setFiltroBlocoApt({ ...filtroBlocoApt, bloco: e.target.value })}
            />
          </>
        )}
      </form>

      <div className="legenda">
        <p className="morador">Morador</p>
        <p className="apartamento">Apartamento</p>
        <p className="bloco">Bloco</p>
        <p className="prestador">Prestador</p>
        <p className="entrada">Entrada</p>
        <p className="saida">Saída</p>
      </div>

      <section className="registros">
        {registros.map((registro) => (
          <Link key={registro.id} to={`./detalhes-do-registro/${registro.id}`}>
            <div className="registro">
              <p className="morador">{registro.morador?.nome || '*******'}</p>
              <p className="apartamento">{registro.morador?.apartamento || '*****'}</p>
              <p className="bloco">{registro.morador?.bloco || '**'}</p>
              <p className="prestador">{limitarNome(registro.prestador?.nome)}</p>
              <p className="entrada">{formatarData(registro.dataInicioDoServico)}</p>
              <p className="saida">{registro.dataEncerramentoDoServico ? formatarData(registro.dataEncerramentoDoServico) : "*******"}</p>
            </div>
          </Link>
        ))}
      </section>
      </>
    )}
      
    </div>
  );
};

export default Registros;
