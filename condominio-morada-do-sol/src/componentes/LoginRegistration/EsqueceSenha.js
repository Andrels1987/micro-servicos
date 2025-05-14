import React, { useState } from 'react'
import { useSendEmailMutation } from '../../features/api/autenticacao/apiSliceAuth';

const EsqueceSenha = () => {
    const [email, setEmail] = useState('')
    const [sendEmail] = useSendEmailMutation();
    const [resposta, setResposta] = useState('')


    const handleEnviarSolicitacaoRedefinicaoSenha = async(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setResposta("Email inválido")
            return;
        }
        console.log("enviando...");
        setResposta("Enviando email....")
        try {
            const result = await sendEmail(email).unwrap()
            console.log("Resultado ", result);
            setResposta(result?.response);
            
        } catch (error) {
            console.log(error);         
            setResposta(error?.status === "FETCH_ERROR"? "Serviço indisponivel" : "Erro desconhecido");   
        }
        
    }
    return (
        <div >
            <form onSubmit={handleEnviarSolicitacaoRedefinicaoSenha}
                style={
                    {
                        color: 'white',
                        fontWeight: '500',
                        height: "30rem",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2em'
                    }}>
                <div style={
                    {

                        display: 'flex',
                        gap: '2em'
                    }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email || ""}
                        placeholder='email'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type='submit'>Enviar</button>
            </form>
            <small data-testid="textresponse"style={{color: "green"}}>{resposta}</small>
        </div>
    )
}

export default EsqueceSenha