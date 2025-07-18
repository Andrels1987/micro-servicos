import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Loading from '../../Loading'
import { useGetMoradorPeloIdQuery, useRemoverMoradorMutation } from '../../features/api/moradores/apiSliceMoradores'

import { useEffect } from 'react'

import AdicionarVeiculos from '../Outros/AdicionarVeiculos'
import AdicionarDependente from '../Outros/AdicionarDependente'




const PerfilMorador = () => {
  
  const { id } = useParams()
  const { data: morador, isLoading, error, refetch } = useGetMoradorPeloIdQuery(id)
  const [removerMorador] = useRemoverMoradorMutation()
  const navigate = useNavigate()
  




  useEffect(() => {
    refetch()
    if (error) {
      navigate("/")
    }
  }, [navigate, error, refetch])

  
 const handleRemoverMorador = async(e) => {
    e.preventDefault();
    try {
      const response = await removerMorador(id).unwrap();
      if(response){
        navigate("/moradores")
        console.log("RESPONSE: ", response);
      }
    } catch (error) {
      console.error(error)
    }
 }


  const renderVeiculos = () => {
    return (
      <div className="veiculos" style={{ maxHeight: '100px' }}>
        <div style={{ display: 'flex', alignContent: 'center' }}>
          <h4>Veiculos</h4>
          <AdicionarVeiculos morador={morador} refetch={refetch} />
        </div>
        {morador.veiculos === null || morador.veiculos.length === 0 ? (
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
    )
  }

  const renderDependentes = () => {
    return (
      <div className='dependentes'>
        <div style={{ display: 'flex', alignContent: 'center' }}>
          <h4>Depedentes</h4>
          <AdicionarDependente morador={morador} refetch={refetch} />
        </div>
        {morador.dependentes === null || morador.dependentes.length === 0 ? (
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
    )
  }
  

  const renderPerfil = () => {
    return (<div className="perfil-morador-card">

      <img src={morador.foto || "../../logo192.png"} alt="foto-morador" />
      <section className='perfil-morador-info'>
        <div>
          <h4>Nome: <code>{morador.nome} {morador.sobrenome}</code> </h4>
          <h6>Apartamento : <code>{morador.apartamento}</code></h6>
          <h6>Bloco : <code>{morador.bloco}</code></h6>
          <h6>Telefone : <code>{morador.telefone}</code></h6>
        </div>
        <div className='btn-atualizar'>
          <Link className='atualizar-morador' to={`../update-morador/${morador.id}`}>Atualizar</Link>
          <button className="deletar-morador" onClick={handleRemoverMorador}>Remover</button>
        </div>
      </section>

      {renderVeiculos()}
      {renderDependentes()}
    </div>)
  }


  return (
    <div className='perfil-morador'>
      <header className='perfil-morador-header'>
      </header>
      {isLoading ? <Loading /> : renderPerfil()}
    </div>
  )
}

export default PerfilMorador