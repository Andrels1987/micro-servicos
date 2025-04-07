import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { useGetServicosPrestadosQuery, useRegistrarEncerramentoDoServicoMutation } from '../../features/api/servicos/apiServicosPrestados';
import { styled } from "styled-components";
import { Link } from 'react-router-dom';
import { format } from 'date-fns'
function PerfilRegistro({ token }) {
    const { data: servicosPrestados } = useGetServicosPrestadosQuery({ token });
    const { idRegistro } = useParams()
    const [registro, setRegistro] = useState({})
    const [registrarEncerramento] = useRegistrarEncerramentoDoServicoMutation();

    const registrarEncerramentoDoServico = () => {
        console.log("REGISTRANDO SAIDA", registro);
        registrarEncerramento({registro})
    }
   
    useEffect(() => {
        if (servicosPrestados) {
            let r = [...servicosPrestados].find(registro => registro.id === idRegistro);
            r =  {
                    apartamento: r.apartamento,
                    bloco: r.bloco,
                    dataEncerramentoDoServico: r.dataEncerramentoDoServico,
                    dataInicioDoServico: format(new Date(r.dataInicioDoServico), "dd-MM-yyyy HH:mm:ss"),
                    id: r.id,
                    idMorador: r.idMorador,
                    idPrestadorDeServico: r.idPrestadorDeServico,
                    nomeMorador: r.nomeMorador,
                    nomePrestador: r.nomePrestador,
                    observacaoSobreServico: r.observacaoSobreServico,
                    tipoDeServico: r.tipoDeServico
                }
       
            setRegistro(old => r);
        }
    }, [servicosPrestados, idRegistro])
   
    

    return (
        <div className='perfil-registro'>
            <div className="detalhes">

                <section className='detalhes-prestador'>
                    <h4>Prestador de serviço</h4>
                    <div className="infos">
                        <h5>{registro.nomePrestador}</h5>
                    </div>
                    <Link className='btn-perfil' to={`../../prestadores/perfil-prestador/${registro.idPrestadorDeServico}`}>ver perfil do Prestador</Link>
                </section>

                <section className='detalhes-morador'>
                    <h4>Morador</h4>
                    <div className="infos">
                        <h5>{registro.nomeMorador}</h5>
                        <h5>{registro.apartamento} | {registro.bloco && registro.bloco.toUpperCase()}</h5>
                    </div>
                </section>
                <section className='detalhes-servico'>
                    <h4>Detalhes do serviço</h4>
                    <div className="infos" style={{height: "auto !important"}}>
                        <h5>{registro.tipoDeServico}</h5>
                        <h5>{registro.observacaoSobreServico}</h5>
                        <h5>Entrada: {registro.dataInicioDoServico}</h5>
                        <h5>Saida: {registro.dataEncerramentoDoServico || "-------"}</h5>
                    </div>
                </section>
            </div>
            <div className="btns">
                <Button
                    disabled={registro.dataEncerramentoDoServico === null ? false : true}
                    $dis={registro.dataEncerramentoDoServico === null ? true : false}
                    onClick={(e) => registrarEncerramentoDoServico(e)}>Finalizar Servico</Button>
            </div>
        </div>
    )
}

export default PerfilRegistro

const Button = styled.button`
  background-color: ${props => props.$dis ? '#BF4F74' : '#EEEEEE'};
  color: #FFFFFF;
  opacity: ${props => props.$dis ? '1' : '0.5'};
  font-weight: bolder;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
`;
