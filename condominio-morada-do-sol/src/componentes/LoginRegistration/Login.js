
import { useLoginMutation } from '../../features/api/autenticacao/apiSliceAuth'
import React, {  useState } from 'react'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../../features/api/autenticacao/sliceToken';
const Login = () => {
  const [getLogin] = useLoginMutation()

  const [login, setLogin] = useState({ username: "", password: "", role: "ADMIN" });
   const navigate = useNavigate();
  const dispatch = useDispatch();
  const makeLogin = async (e) => {
    e.preventDefault();
    const { data: t } = await getLogin({ login });
    console.log("Login : ", t);
    if (t.token !== null) {
      sessionStorage.setItem("jwt", t.token)
      dispatch(setToken(t.token))
      navigate("/prestadores")
      return;
    }
    window.alert("Login não confere");
  }

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

        <Button onClick={(e) => makeLogin(e)}>Login</Button>

      </Form>
    </div>
  )
}

export default Login