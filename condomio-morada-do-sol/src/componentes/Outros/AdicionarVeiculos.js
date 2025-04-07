import React, { useState } from 'react'
import { Box, Button, Modal, Typography } from '@mui/material'
import { useEnviarVeiculoMutation, useLazyGetVeiculoPelaPlacaQuery } from '../../features/api/veiculos/veiculoApiSlice'
import { useUpdateMoradorMutation } from '../../features/api/moradores/apiSliceMoradores'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const btnStyle = {
    fontWeight: 'bold',
    fontSize: '1.5em',
}

const AdicionarVeiculos = ({ morador, veiculo, setVeiculo, dadosMorador, setDadosMorador, refetch }) => {
    
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [triggerSearchVeiuloPeloId, { data: singleVeiculo }] = useLazyGetVeiculoPelaPlacaQuery()

    const [dadosAtualizadosMorador] = useUpdateMoradorMutation();
    const [enviarDadosVeiculo] = useEnviarVeiculoMutation();
    const [disableEnviar, setDisableEnviar] = useState(true)
    const [disableAtualizar, setDisableAtualizar] = useState(true)

    const sendDadosDoVeiculo = (e) => {
        e.preventDefault()
        console.log(veiculo);

        const resposta = enviarDadosVeiculo({ veiculo })
        resposta.then((r) => {
            console.log(r);
            setDadosMorador({ ...dadosMorador, veiculos: [...dadosMorador.veiculos, r.data.id] })
        })
        setDisableEnviar(true)
    }

    const buscarVeiculoPelaPlaca = (e) => {
        e.preventDefault();
        let res = triggerSearchVeiuloPeloId({ placa: veiculo.placa });
        res.then((res) => {
            console.log("RESP : ", res.data);
            if (res?.data.err) {
                console.log('entrou aqui');
                setDisableEnviar(false)
                return;
            } else {
                setVeiculo(old => res.data)
                for (const veiculo of morador.veiculos) {
                    if (veiculo._id === res.data._id) {
                        alert("O morador já possui esse veiculo")
                        setDisableAtualizar(true)
                        return;
                    }
                }
                setDadosMorador({ ...dadosMorador, veiculos: [...dadosMorador.veiculos, res.data._id] })
                setDisableAtualizar(false)
            }
        });
    }


    const associarVeiculoAoMorador = (e) => {
        e.preventDefault();
        console.log("DADOS MORADOR : ", dadosMorador);
        const resposta = dadosAtualizadosMorador({ morador: dadosMorador })
        resposta.then((res) => {
            console.log("RESP : ", res);
            refetch();
        })
    }

   
    
    return (
        <div>
            <Button sx={btnStyle} onClick={handleOpen}>+</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <section>
                        <input type="text" onChange={(e) => setVeiculo({ ...veiculo, placa: e.target.value })} name='placa' placeholder='placa' id='placa' />
                        <button onClick={(e) => buscarVeiculoPelaPlaca(e)}>buscar</button>
                    </section>
                    <input type="text" onChange={(e) => setVeiculo({ ...veiculo, modelo: e.target.value })} name='modelo' placeholder='modelo' id='modelo' value={veiculo.modelo || ""} />
                    <input type="text" onChange={(e) => setVeiculo({ ...veiculo, marca: e.target.value })} name='marca' placeholder='marca' id='marca' value={veiculo.marca || ""} />
                    <input type="text" onChange={(e) => setVeiculo({ ...veiculo, cor: e.target.value })} name='cor' placeholder='cor' id='cor' value={veiculo.cor || ""} />
                    <input type="text" onChange={(e) => setVeiculo({ ...veiculo, vaga: e.target.value })} name='vaga' placeholder='vaga' id='vaga' value={veiculo.vaga || ""} />
                    <input type="text" onChange={(e) => setVeiculo({ ...veiculo, tipoDeAutorizacao: e.target.value })} name='tipo-autorização' value={veiculo.tipoDeAutorizacao || ""} placeholder='tipo-autorização' id='tipo-autorização' />
                    <input type="text" onChange={(e) => setVeiculo({ ...veiculo, status_de_acesso: e.target.value })} name='acesso' placeholder='acesso' id='acesso' value={veiculo.status_de_acesso || ""} />
                    <textarea onChange={(e) => setVeiculo({ ...veiculo, observacao: e.target.value })} name="observacao" id="observacao" value={veiculo.observacao || ""}></textarea>
                    <Button disabled={disableEnviar} onClick={(e) => sendDadosDoVeiculo(e)}>Enviar</Button>
                    <Button disabled={disableAtualizar} onClick={(e) => associarVeiculoAoMorador(e)}>Associar veiculo ao morador</Button>
                </Box>
            </Modal>
        </div>
    )
}

export default AdicionarVeiculos