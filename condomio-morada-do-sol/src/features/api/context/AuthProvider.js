import React, { createContext, useEffect, useState } from 'react'



export const AuthContext = createContext()
const AuthProvider = ({children}) => {

    const [token, setToken] = useState(null)

    useEffect(()=> {
        const storedToken = sessionStorage.getItem("jwt");
        if(storedToken){
            setToken(storedToken)
        }
    },[])

    const login = (token) => {
        sessionStorage.setItem("jwt", token);
        setToken(token);
      };
    
      const logout = () => {
        sessionStorage.removeItem("jwt");
        setToken(null);
      };

  return (
    <AuthContext.Provider value={{token,setToken, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider