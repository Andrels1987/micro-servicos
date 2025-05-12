import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useRedefinirSenhaMutation } from '../../features/api/autenticacao/apiSliceAuth';

const RedefinirSenha = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [resetPassword] = useRedefinirSenhaMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem');
      return;
    }
    
    try {
      const response = await resetPassword({token, newPassword}).unwrap()
      console.log(response);
      setMessage(response.data.message || 'Senha redefinida com sucesso!');
    } catch (error) {
      //console.error(error);
      setMessage('Erro ao redefinir senha');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='senha'>Nova senha:</label>
          <input
            name='senha'
            id='senha'
            data-testid="senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='novasenha'>Confirmar nova senha:</label>
          <input
          name='novasenha'
            id='novasenha'
            data-testid="novasenha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Redefinir</button>
      </form>
      {message && <p style={{ marginTop: '20px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default RedefinirSenha;
