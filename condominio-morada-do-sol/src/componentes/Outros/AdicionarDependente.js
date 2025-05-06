import { Box, Button, Modal } from '@mui/material'
import React, { useState } from 'react'
import { useAssociarDependenteAoMoradorMutation, useLazyGetMoradorPeloDocumentoQuery } from '../../features/api/moradores/apiSliceMoradores';

const dependenteModel ={
    id: "",
    nome: "",
    sobrenome: "",
    apartamento: "",
    bloco: "",
    foto: "",
    telefone: ""   ,
    documento: "",
    parentesco: ""
}
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
    
const AdicionarDependente = ({morador, refetch}) => {
    const [dependente, setDependente] = useState(dependenteModel)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [disableAtualizar, setDisabledAtualizar] = useState(true)
    const [getMoradorPeloDocumento] = useLazyGetMoradorPeloDocumentoQuery();
    const [associarDependente] = useAssociarDependenteAoMoradorMutation();

    const buscarDependentePeloDocumento = (e) => {
        e.preventDefault();
        const resultado = getMoradorPeloDocumento({documento : dependente.documento})
        resultado.then((res) => {
            if(res.data.id === null){
                alert("Nenhum moradorcom esse documento")
            }
            dependenteModel.id = res.data.id;
            dependenteModel.foto = res.data.foto;
            dependenteModel.nome = res.data.nome;
            dependenteModel.sobrenome = res.data.sobrenome;
            
            setDependente(old =>( 
                {...dependente, 
                    nome: dependenteModel.nome, 
                    sobrenome: dependenteModel.sobrenome,   
                    id: dependenteModel.id,
                    foto: dependenteModel.foto
                }));
            setDisabledAtualizar(!disableAtualizar)
        }) 
    }


    const associarDependenteAoMorador = (e) => {
        e.preventDefault();
        const resposta = associarDependente({idMorador: morador.id, dependente})
        resposta.then(res => {
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
                        <input type="text" onChange={(e) => setDependente({ ...dependente, documento: e.target.value })} name='documento' placeholder='documento' id='documento' value={ dependente.documento || ""}/>
                        <button onClick={(e) => buscarDependentePeloDocumento(e)}>buscar</button>
                    </section>
                    <div>
                        <img src={dependente.foto || '../../logo192.png'} alt="" />
                    </div>
                    <input type="text" onChange={(e) => setDependente({ ...dependente, nome: e.target.value })} name='nome' placeholder='nome' id='nome' value={dependente.nome || ""} />
                    <input type="text" onChange={(e) => setDependente({ ...dependente, sobrenome: e.target.value })} name='sobrenome' placeholder='sobrenome' id='sobrenome' value={dependente.sobrenome || ""} />
                    <input type="text" onChange={(e) => setDependente({ ...dependente, parentesco: e.target.value })} name='parentesco' placeholder='parentesco' id='parentesco' value={dependente.parentesco || ""} />
                    
                    <Button disabled={disableAtualizar} onClick={(e) => associarDependenteAoMorador(e)}>Associar dependente ao morador</Button>
                </Box>
            </Modal>
    </div>
  )
}

export default AdicionarDependente