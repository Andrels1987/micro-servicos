import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getPrestadorPeloId, deletePrestador } from '../../features/api/prestadores/apiPrestadorSlice';
import { useSelector } from 'react-redux';
import Loading from '../../Loading';
import { useGetServicosPrestadosQuery } from '../../features/api/servicos/apiServicosPrestados';
import { useState } from 'react';
import { format } from 'date-fns'
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";




const PerfilPrestador = ({ token , handleDelete}) => {
  const { idPrestador: id } = useParams();
  const { data: servicosPrestados } = useGetServicosPrestadosQuery({ token });
  const { idPrestador } = useParams();
  const prestador = useSelector(state => getPrestadorPeloId(state, idPrestador))
  const [entregasPorPrestador, setEntregasPorPrestador] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    if (servicosPrestados) {
      
      let registros = servicosPrestados.filter((entrega) => {
        //console.log(entrega.id, " : ", idPrestador);        
        return entrega.idPrestadorDeServico === id
      });
      let registroFormatado = []
      registros.map(r => {
        let entrada = `${format(new Date(r.dataInicioDoServico), "dd-MM-yyyy\tHH:mm:ss")}`;
        let saida = null;
        if (r.dataEncerramentoDoServico) {
          saida = `${format(new Date(r.dataEncerramentoDoServico), "dd-MM-yyyy\tHH:mm:ss")}`;
        }
        let rf = {
          id: r.id,
          nomeMorador: r.nomeMorador,
          apt: r.apartamento,
          bl: r.bloco,
          entrada: entrada,
          saida: saida
        }

        registroFormatado.push(rf)
        return null;
      })
      setEntregasPorPrestador([...registroFormatado]);
    }
  }, [servicosPrestados])


  return (
    <div data-testid="prestador-profile" className='perfil-prestador'>
      <header className='perfil-prestador-header'></header>
      {!prestador ? <Loading /> : (

        <div className="perfil-prestador-card">


          <img src={prestador.foto || "../../logo192.png"} alt="foto-morador" />
          <div className="perfil-prestador-info">
            <h4><code>{prestador.nome} {prestador.sobrenome}</code> </h4>
            <h6>Empresa : <code>{prestador.empresa}</code></h6>
            <h6>Documento : <code>{prestador.numeroDocumento}</code></h6>
            <h6>Tipo de serviço : <code>{prestador.servicoPrestado}</code></h6>
          </div>
          <div className="btns">
            <button
              onClick={() => handleDelete(prestador.id, token)}
            >
              deletar
            </button>
            <Link to={`../update-prestador/${prestador.id}`}>
              Atualizar
            </Link>
            <Link to={`../../registros/registrar-entrada/${prestador.id}`}>
              Registrar entrada
            </Link>
          </div>

        </div>
      )}

      <div className="registros">
        {/**TRANFORMAR EM COMPONENTE */}
        <div className="cabecalho">
          <p className="nome-morador">Morador</p>
          <p className="apt-morador">Apartamento</p>
          <p className="bl-morador">bloco</p>
          <p className="data-entrada">entrada</p>
          <p className="data-saida">saida</p>
        </div>
        {entregasPorPrestador.map(e => (
            <Link key={e.id} to={`../../registros/detalhes-do-registro/${e.id}`}>
          <div  className="regitro-de-dados" style={
            {
              backgroundColor: e.saida === null ? "" : "#30be96"
            }
          }>
              <p className="nome-morador">{e.nomeMorador}</p>
              <p className="apt-morador">{e.apt}</p>
              <p className="bl-morador">{e.bl}</p>
              <p className="data-entrada">{e.entrada}</p>
              <p className="data-saida">{e.saida || "----------"}</p>
          </div>
            </Link>
        ))}
      </div>
    </div>

  )
}

export default PerfilPrestador