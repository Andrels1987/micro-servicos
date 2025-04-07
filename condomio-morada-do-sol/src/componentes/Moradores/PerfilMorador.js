import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import Loading from '../../Loading'
import { useGetMoradorPeloIdQuery, useUpdateMoradorMutation} from '../../features/api/moradores/apiSliceMoradores'

import { useEffect } from 'react'

import AdicionarVeiculos from '../Outros/AdicionarVeiculos'
import AdicionarDependente from '../Outros/AdicionarDependente'


const veiculoModel = {
    placa: "",
    modelo: "",
    marca: "",
    cor: "",
    vaga: "",
    tipoDeAutorizacao: "",
    status_de_acesso: "",
    nomeProprietario: "",
    apartamento: "",
    bloco: "",
    documentoProprietario: "",
    observacao: ""
  }

const PerfilMorador = ({ token }) => {
  const { id } = useParams()
  
  /* const [dependentes, setDependentes] = useState([]) */
  const { data: morador, isLoading, error, refetch } = useGetMoradorPeloIdQuery({ token, id })
  
  const [dadosMorador, setDadosMorador] = useState({ veiculos: [] });
  const navigate = useNavigate()
  const [veiculo, setVeiculo] = useState({});
 

  

  useEffect(() => {
    if (error) {
      navigate("/")
    }
    if (morador) {
      
      veiculoModel.nomeProprietario = morador.nome + " " + morador.sobrenome;
      veiculoModel.apartamento = morador.apartamento;
      veiculoModel.bloco = morador.bloco;
      veiculoModel.documentoProprietario = morador.documento;
      setDadosMorador({ ...morador, veiculos: [...dadosMorador.veiculos || []] })
      setVeiculo(old => veiculoModel);
    }
  }, [error, morador])

console.log(morador);


  return (
    <div className='perfil-morador'>
      <header className='perfil-morador-header'>
      </header>
      {isLoading ? <Loading /> : (
        <div className="perfil-morador-card">

          <img src={morador.foto || "../../logo192.png"} alt="foto-morador" />
          <section className='perfil-morador-info'>
            <div>
              <h4>Nome: <code>{morador.nome} {morador.sobrenome}</code> </h4>
              <h6>Apartamento : <code>{morador.apartamento}</code></h6>
              <h6>Bloco : <code>{morador.bloco}</code></h6>
              <h6>Telefone : <code>{morador.telefone}</code></h6>
            </div>
            <div className='btn-atualizar'>
              <Link to={`../update-morador/${morador.id}`}>atualizar</Link>
            </div>
          </section>

          <div className="veiculos" style={{ maxHeight: '100px' }}>
            <div style={{display: 'flex', alignContent: 'center'}}>
              <h4>Veiculos</h4>
                  <AdicionarVeiculos morador={morador} veiculo={veiculo} setVeiculo={setVeiculo} 
                        dadosMorador={dadosMorador} setDadosMorador={setDadosMorador} refetch={refetch}/>
            </div>
            {morador.veiculos === null || morador.veiculos.length === 0? (
              <div>
              <p>nenhum veiculo</p>
              </div>
            ) : (
              <div >
                <div className='veiculo-info'>
                  {morador.veiculos.map(v => (
                    <div key={v.placa} className='veiculo'>
                      <p><code>{v.marca} | {v.modelo} | {v.placa} | {v.cor}</code></p>
                      <Link className='link-veiculo' to={`../../veiculos/perfil-veiculo/${v._id}`}>informacões do veiculo</Link>

                    </div>

                  ))}
                </div>
              </div>)}
          </div>
          <div className='dependentes'>
            <div style={{display: 'flex', alignContent: 'center'}}>
              <h4>Depedentes</h4>
              <AdicionarDependente morador={morador}  refetch={refetch}/>
            </div>
            {morador.dependentes === null || morador.dependentes.length === 0? (
              <div>sem dependentes</div>
            ) : (
              <div>
                {morador.dependentes.map((dependente) => (
                  <div key={dependente._id}>
                    <div>
                      <Link to={`../perfil/${dependente._id}`}>{dependente.nome} {dependente.sobrenome} | {dependente.parentesco}</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      )}

    </div>
  )
}

export default PerfilMorador