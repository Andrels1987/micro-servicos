import React, { useState } from 'react'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../../features/api/autenticacao/sliceToken';
import { useLoginMutation } from '../../features/api/autenticacao/apiSliceAuth'
const Login = () => {

  const [getLogin] = useLoginMutation();

  const [login, setLogin] = useState({ username: "", password: "", role: "ADMIN" });
  const navigate = useNavigate();
  const [message, setMessage] = useState("")
  const dispatch = useDispatch();


  const makeLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await getLogin({ login });

      if (!data) {
        setMessage("Sem conexão...");
        return;
      }

      const { response } = data;

      if (response === "Bad credentials") {
        setMessage("Login não confere");
        return;
      }

      // Sucesso
      console.log(data)
      sessionStorage.setItem("jwt", response);
      dispatch(setToken(response));
      navigate("/prestadores");

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMessage("Erro inesperado. Tente novamente.");
    }
  };


  return (
    <div className="login">

      <Form className='form-login'>
        <Form.Text >Login</Form.Text>
        <Form.Group className='mb-3' controlId='formBasicUsename'>
          <Form.Label>Username</Form.Label>
          <Form.Control type='text' placeholder='enter username'
            onChange={(e) => setLogin({ ...login, username: e.target.value })}></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='text' placeholder='enter password'
            onChange={(e) => setLogin({ ...login, password: e.target.value })}></Form.Control>
        </Form.Group>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button style={{ width: '10em' }} data-testid="button-login" onClick={(e) => makeLogin(e)}>Login</Button>
          <Link to={'/esqueceu-senha'}>esqueceu a senha</Link>
        </div>
        <small>{message}</small>
      </Form>
    </div>
  )
}

export default Login