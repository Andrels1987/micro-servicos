import React, {  useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deletePrestador, getPrestadorPeloId } from '../../features/api/prestadores/apiPrestadorSlice';
import { useGetServicosPrestadosQuery } from '../../features/api/servicos/apiServicosPrestados';
import Loading from '../../Loading';
import { format } from 'date-fns';

const PerfilPrestador = () => {

  
  const { idPrestador } = useParams();
  const prestador = useSelector(state => getPrestadorPeloId(state, idPrestador));
  
  const { data: servicosPrestados } = useGetServicosPrestadosQuery();
  const [entregasPorPrestador, setEntregasPorPrestador] = useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!servicosPrestados) return;
  
    const registrosFormatados = servicosPrestados.reduce((acc, entrega) => {
      const mesmoPrestador = entrega.idPrestadorDeServico === idPrestador;
      if (!mesmoPrestador) return acc;
  
      acc.push({
        id: entrega.id,
        nomeMorador: entrega.nomeMorador,
        apt: entrega.apartamento,
        bl: entrega.bloco,
        entrada: format(new Date(entrega.dataInicioDoServico), 'dd-MM-yyyy\tHH:mm:ss'),
        saida: entrega.dataEncerramentoDoServico
          ? format(new Date(entrega.dataEncerramentoDoServico), 'dd-MM-yyyy\tHH:mm:ss')
          : null,
      });
  
      return acc;
    }, []);
  
    setEntregasPorPrestador(registrosFormatados);
  }, [servicosPrestados, idPrestador]);
  


  const handleDelete = (id) => {
    dispatch(deletePrestador({ id }));
    navigate("/prestadores")
  };

  if (!prestador) return <Loading />;

  return (
    <div data-testid="prestador-profile" className="perfil-prestador">
      <header className="perfil-prestador-header"></header>

      <div className="perfil-prestador-card">
        <img src={prestador.foto || '../../logo192.png'} alt="foto-morador" />
        <div className="perfil-prestador-info">
          <h4>
            <code>{prestador.nome} {prestador.sobrenome}</code>
          </h4>
          <h6>Empresa: <code>{prestador.empresa}</code></h6>
          <h6>Documento: <code>{prestador.numeroDocumento}</code></h6>
          <h6>Tipo de serviço: <code>{prestador.servicoPrestado}</code></h6>
        </div>
        <div className="btns">
          <button onClick={() => handleDelete(prestador.id)}>Deletar</button>
          <Link to={`../update-prestador/${prestador.id}`}>Atualizar</Link>
          <Link to={`../../registros/registrar-entrada/${prestador.id}`}>Registrar entrada</Link>
        </div>
      </div>

      <div className="registros">
        <div className="cabecalho">
          <p className="nome-morador">Morador</p>
          <p className="apt-morador">Apartamento</p>
          <p className="bl-morador">Bloco</p>
          <p className="data-entrada">Entrada</p>
          <p className="data-saida">Saída</p>
        </div>

        {entregasPorPrestador.map(e => (
          <Link key={e.id} to={`../../registros/detalhes-do-registro/${e.id}`}>
            <div
              className="regitro-de-dados"
              style={{ backgroundColor: e.saida ? '#30be96' : '' }}
            >
              <p className="nome-morador">{e.nomeMorador}</p>
              <p className="apt-morador">{e.apt}</p>
              <p className="bl-morador">{e.bl}</p>
              <p className="data-entrada">{e.entrada}</p>
              <p className="data-saida">{e.saida || '----------'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PerfilPrestador;
