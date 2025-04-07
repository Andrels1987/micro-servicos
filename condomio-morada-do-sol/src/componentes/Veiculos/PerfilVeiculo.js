import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useGetVeiculoPeloIdQuery } from '../../features/api/veiculos/veiculoApiSlice'
import { useGetProprietarioPelaPlacaVeiculoQuery } from '../../features/api/moradores/apiSliceMoradores'


const PerfilVeiculo = ({ token }) => {
  const { id } = useParams()
  const [placa, setPlaca] = useState("")
  const { data: veiculo } = useGetVeiculoPeloIdQuery({ token, id })
  const { data: proprietario } = useGetProprietarioPelaPlacaVeiculoQuery({ token, placa })

  useEffect(() => {
    if (veiculo) {
      setPlaca(veiculo.placa)
      setPlaca(veiculo.placa)
      setPlaca(veiculo.placa)
    }
  }, [veiculo])

console.log(veiculo);

  return (
    <div className='perfil-veiculo'>
      <header className='perfil-veiculo-header'></header>
      {!veiculo ? <p>Loading...</p> : (

        <article className='perfil-veiculo-card'>

          <img src={veiculo.foto || "../../logo192.png"} alt="foto-veiculo" />
          <div className='perfil-veiculo-info'>
            <h6>Marca: <code>{veiculo.marca}</code></h6>
            <h6>Modelo : <code>{veiculo.modelo}</code></h6>
            <h6>Cor : <code>{veiculo.cor}</code></h6>
            <h6>Placa : <code>{veiculo.placa}</code></h6>
            <h6>Proprietario</h6>
          </div>
          <div className='proprietario-info'>
            {!proprietario ? (
              <p>Loading...</p>
            ) : (
              <div className='dependente-info'>
                <p aria-label="proprietario" key={proprietario.id}><code>{proprietario.nome} {proprietario.sobrenome} | {proprietario.apartamento} {proprietario.bloco}</code></p>
              </div>
            )}
          </div>
        </article>

      )}
    </div>
  )
}

export default PerfilVeiculo