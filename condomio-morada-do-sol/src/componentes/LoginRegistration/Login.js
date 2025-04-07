import React from 'react'

const Login = ({makeLogin, setLogin, login}) => {

    
  return (
    <div>
        <form action="">
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" onChange={(e) => setLogin({...login, email : e.target.value})} name='email'  id='email'/>
            </div>
            <div>
                <label htmlFor="senha">Senha</label>
                <input type="password" onChange={(e) => setLogin({...login, password:e.target.value})} name='senha' id='senha'/>
            </div>
            <button onClick={(e) => makeLogin(e)}>Login</button>
        </form>
    </div>
  )
}

export default Login