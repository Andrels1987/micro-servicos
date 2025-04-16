
import React, {useContext, useState} from 'react'
import { useLoginMutation } from '../../features/api/autenticacao/apiSliceAuth'
import { AuthContext } from '../../features/api/context/AuthProvider'

const Login = () => {
  const [getLogin] = useLoginMutation()
    const {token, setToken} = useContext(AuthContext);
    const [login, setLogin] = useState({ username: "", password: "", role: "ADMIN" });
    
     const makeLogin = async (e) => {
        e.preventDefault();        
        const { data: t } = await getLogin({login});
        if (t.token !== null && t.token !== "") {
          sessionStorage.setItem("jwt", t.token)
          console.log("Login : ", t);
          setToken(t.token)
          return;
        }
        window.alert("Login não confere");
      }

  return (
    <div>
        <form action="">
            <div>
                <label htmlFor="username">Username</label>
                <input type="username" onChange={(e) => setLogin({...login, username : e.target.value})} name='username'  id='username'/>
            </div>
            <div>
                <label htmlFor="password">Senha</label>
                <input type="password" onChange={(e) => setLogin({...login, password:e.target.value})} name='password' id='password'/>
            </div>
            <button onClick={(e) => makeLogin(e)}>Login</button>
        </form>
    </div>
  )
}

export default Login