import React, { useEffect, useState } from 'react'
import { Box, Button, Modal, TextField, TextareaAutosize } from '@mui/material'
import { useEnviarVeiculoMutation, useLazyGetVeiculoPelaPlacaQuery } from '../../features/api/veiculos/veiculoApiSlice'
import { useUpdateMoradorMutation } from '../../features/api/moradores/apiSliceMoradores'


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const btnStyle = {
  fontWeight: 'bold',
  fontSize: '1.5em',
}

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

const AdicionarVeiculos = ({ morador, refetch }) => {

  const [open, setOpen] = useState(false)
  const [veiculo, setVeiculo] = useState(veiculoModel)
  const [disableEnviar, setDisableEnviar] = useState(true)
  const [disableAssociar, setDisableAssociar] = useState(true)

  const [enviarVeiculo] = useEnviarVeiculoMutation()
  const [buscarVeiculo] = useLazyGetVeiculoPelaPlacaQuery()
  const [atualizarMorador] = useUpdateMoradorMutation()

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setVeiculo(veiculoModel)
    setDisableEnviar(true)
    setDisableAssociar(true)
  }

  useEffect(() => {
    if (morador) {
      setVeiculo({
        ...veiculoModel,
        nomeProprietario: `${morador.nome} ${morador.sobrenome}`,
        apartamento: morador.apartamento,
        bloco: morador.bloco,
        documentoProprietario: morador.documento
      })
    }
  }, [morador])

  const handleChange = (field) => (e) => {
    setVeiculo((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleBuscarPlaca = async (e) => {
    e.preventDefault()

    const res = await buscarVeiculo({ placa: veiculo.placa })

    if (res?.data?.err) {
      setDisableEnviar(false)
      setDisableAssociar(true)
    } else {
      const jaPossui = morador.veiculos?.some(v => v._id === res.data._id)
      if (jaPossui) {
        alert("O morador já possui esse veículo.")
        setDisableEnviar(true)
        setDisableAssociar(true)
      } else {
        setVeiculo(res.data)
        setDisableEnviar(true)
        setDisableAssociar(false)
      }
    }
  }

  const handleEnviarVeiculo = async (e) => {
    e.preventDefault()
    await enviarVeiculo({ veiculo })
    setDisableEnviar(true)
    setDisableAssociar(false);
  }

  const handleAssociarVeiculo = async (e) => {
    e.preventDefault()
    const veiculoIds = morador.veiculos?.map(v => v._id) || []
    await atualizarMorador({
      morador: { ...morador, veiculos: [...veiculoIds, veiculo._id] }
    })
    refetch()
    handleClose()
  }

  return (
    <div>
      <Button sx={btnStyle} onClick={handleOpen}>+</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form>
            <TextField fullWidth margin="normal" label="Placa" value={veiculo.placa} onChange={handleChange('placa')} />
            <Button onClick={handleBuscarPlaca}>Buscar</Button>

            <TextField fullWidth margin="normal" label="Modelo" value={veiculo.modelo} onChange={handleChange('modelo')} />
            <TextField fullWidth margin="normal" label="Marca" value={veiculo.marca} onChange={handleChange('marca')} />
            <TextField fullWidth margin="normal" label="Cor" value={veiculo.cor} onChange={handleChange('cor')} />
            <TextField fullWidth margin="normal" label="Vaga" value={veiculo.vaga} onChange={handleChange('vaga')} />
            <TextField fullWidth margin="normal" label="Tipo de Autorização" value={veiculo.tipoDeAutorizacao} onChange={handleChange('tipoDeAutorizacao')} />
            <TextField fullWidth margin="normal" label="Status de Acesso" value={veiculo.status_de_acesso} onChange={handleChange('status_de_acesso')} />
            <TextareaAutosize
              minRows={3}
              placeholder="Observação"
              style={{ width: '100%', marginTop: '1em' }}
              value={veiculo.observacao}
              onChange={handleChange('observacao')}
            />

            <Button fullWidth sx={{ mt: 2 }} disabled={disableEnviar} onClick={handleEnviarVeiculo}>Enviar</Button>
            <Button fullWidth sx={{ mt: 1 }} disabled={disableAssociar} onClick={handleAssociarVeiculo}>Associar ao morador</Button>
          </form>
        </Box>
      </Modal>
    </div>
  )
}

export default AdicionarVeiculos
