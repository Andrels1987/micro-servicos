import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { styled } from "styled-components";
import { useGetServicosPrestadosQuery } from "../../features/api/servicos/apiServicosPrestados";
import { nanoid } from "@reduxjs/toolkit";
import { format } from 'date-fns'
import { useGetMoradoresQuery } from "../../features/api/moradores/apiSliceMoradores";
import { useAddServicoPrestadoMutation } from "../../features/api/servicos/apiServicosPrestados";


const RegistrarEntrada = ({ token }) => {
  const { idPrestador: id } = useParams();
  const [modoBusca, setModoBusca] = useState('nome');
  const prestadores = useSelector((state) => state.prestador.prestadores);
  const { data: moradores } = useGetMoradoresQuery({ token });
  const { data: servicosPrestados, error } = useGetServicosPrestadosQuery({ token });
  const [addServico] = useAddServicoPrestadoMutation();
  const [prestador, setPrestador] = useState({});
  const [morador, setMorador] = useState({ nome: "", apartamento: "", bloco: "" });
  const [servicoPorPrestador, setServicoPorPrestador] = useState([]);
  const [tipoDeServico, setTipoDeServico] = useState("");

  const [moradorFiltrado, setMoradorFiltrado] = useState([]);
  const [moradorEscolhido, setMoradorEscolhido] = useState({});
  const navigate = useNavigate()



  useEffect(() => {
    if (error) {
      navigate("/")
    }
    if (!(prestadores.length === 0)) {
      let prest = prestadores.find((prestador) => prestador.id === id);
      setPrestador({ ...prest });
    }
    if (servicosPrestados) {
      let registros = servicosPrestados.filter((servico) => servico.idPrestadorDeServico === id);

      let registroFormatado = []
      registros.map(r => {
        let data = `${format(new Date(r.dataInicioDoServico), "dd-MM-yyyy\tHH:mm:ss")}`;
        let rf = {
          id: r.id,
          nomeMorador: r.nomeMorador,
          apt: r.apartamento,
          bl: r.bloco,
          entrada: data,
          saida: undefined
        }

        registroFormatado.push(rf)
        return null;
      })
      setServicoPorPrestador([...registroFormatado]);
    }
    if (morador.nome !== undefined || morador.apartamento !== undefined || morador.bloco !== undefined) {
      procurarMorador();
    }
  }, [prestadores, morador, moradorEscolhido, servicosPrestados, setServicoPorPrestador]);

  const procurarMorador = () => {
    if (moradores) {
      let mf = moradores;
      if (morador.nome !== undefined) {
        mf = mf.filter(m => m.nome.includes(morador.nome))
      }

      if (morador.apartamento !== undefined) {
        const pattern = `^${morador.apartamento}`
        //mf =  mf.filter(m => m.apartamento.includes(`[^${morador.apartamento}]`))
        mf = mf.filter(m => m.apartamento.match(pattern))
      }
      if (morador.bloco !== undefined) {
        mf = mf.filter(m => m.bloco.toUpperCase().includes(morador.bloco.toUpperCase()))
      }


      /*
       if(m.nome.includes(morador.nome)){

      }
      if(m.nome.includes(morador.nome)){
          
      }
      if(m.nome.includes(morador.nome)){
          
      }
      if(m.nome.includes(morador.nome) || 
          m.apartamento.includes(morador.apartamento) ||
          (morador.bloco || m.bloco.toUpperCase() === morador.bloco.toUpperCase())){
              mf.push({...m});
              console.log(mf);
      }
      */
      //return null; 
      //})
      if (morador.nome === "" && morador.apartamento === "" && morador.bloco === '') {
        mf = [];
      }
      setMoradorFiltrado(mf);
    }

    /* if (morador.nome === "") {
      setMoradorFiltrado([])
    } */
  };
  const finalizarRegistroDePrestacaoDeServico = () => {
    const entregaServico = {
      idPrestadorDeServico: prestador.id,
      idMorador: moradorEscolhido.id,
      tipoDeServico: tipoDeServico,
      observacaoSobreServico: moradorEscolhido.observacao
    }
    console.log(entregaServico);
    //passar como um unico objeto
    //não aceita dois parametros
    addServico({ entregaServico })

  }

  return (
    <article className="registrar-entrada">
      <section className="prestador-area">
        <Foto src={prestador.foto} alt="foto-prestador" />
        <div>
          <Info><Code>{prestador.nome}</Code></Info>
        </div>
      </section>

      <div className="area-de-busca">
        <div className='modo-busca'>
          <label htmlFor="nome">Modo de busca</label>
          <select onChange={(e) => setModoBusca(e.target.value)} value={modoBusca} name="" id="">
            <option value="nome">Nome</option>
            <option value="documento">Apartamento/Bloco</option>
          </select>

          <form action="">
            {modoBusca === 'nome' ? (
              <div>
                <input name="nome" id="nome" type="text" placeholder='Nome do morador' onChange={(e) => setMorador({ ...morador, nome: e.target.value })} />
              </div>
            ) : (
              <div>
                <div>
                  <input
                    type="text"
                    id="apartamento"
                    name="apartamento"
                    placeholder="apartamento"
                    onChange={(e) =>
                      setMorador({ ...morador, apartamento: e.target.value })
                    }
                    value={morador.apartamento || ""}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="bloco"
                    name="bloco"
                    placeholder="bloco"
                    onChange={(e) =>
                      setMorador({ ...morador, bloco: e.target.value })
                    }
                    value={morador.bloco || ""}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <section className="lista" >
          {moradorFiltrado.map((mf) => (
            <div key={nanoid()}>
              <h1 onClick={() => setMoradorEscolhido({ ...mf })}>{mf.nome}</h1>
            </div>
          ))}
        </section>
      </div>

      <section className="morador">

        <h4>Dados da Entrega</h4>
        <h1>Nome morador: <span>{moradorEscolhido.nome} {moradorEscolhido.sobrenome}</span></h1>
        <h1>Bloco: <span>{moradorEscolhido.bloco}</span></h1>
        <h1>Apartamento: <span>{moradorEscolhido.apartamento}</span></h1>
        <h1>Tipo de serviço: <input style={{
          borderRadius: '10px',
          backgroundColor: 'transparent',
          color: 'white',
          border: '1px solid white',
          outline: 'none',
          minWidth: '50%',
        }} onChange={(e) => setTipoDeServico(e.target.value)} /></h1>
        <label htmlFor="obs">Observação</label>
        <textarea name="" id="obs" cols="30" rows="8" onChange={(e) => setMoradorEscolhido({ ...moradorEscolhido, observacao: e.target.value })} value={moradorEscolhido.observacao || ""} />
        <input type="button" value="confirmar entrada" onClick={finalizarRegistroDePrestacaoDeServico} />

      </section>
    </article>
  );
};

export default RegistrarEntrada;

const Info = styled.h1`
    fontWeight: bolder;   

`;
const Code = styled.code`
    color: white;
`;
const Foto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%
`;
