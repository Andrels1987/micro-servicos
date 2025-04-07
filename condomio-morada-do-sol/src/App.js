	import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { deletePrestador, fetchPrestadores, getStatus } from "./features/api/prestadores/apiPrestadorSlice";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./componentes/HomePage";
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";


import MoradoresList from "./componentes/Moradores/MoradoresList";
import PrestadorPage from "./componentes/Prestadores/PrestadorPage";
import MoradorLayout from "./componentes/Moradores/MoradorLayout";
import FormMoradores from "./componentes/Moradores/FormMoradores";
import PerfilMorador from "./componentes/Moradores/PerfilMorador";
import Veiculos from "./componentes/Veiculos/Veiculos";
import PerfilVeiculo from "./componentes/Veiculos/PerfilVeiculo";
import { useGetLoginMutation, useGetMoradoresQuery, useGetTokenQuery, useLogoutAppMutation } from "./features/api/moradores/apiSliceMoradores";
import RegistrarEntrada from "./componentes/Servicos/RegistrarEntrada";

import { useGetVeiculosQuery } from "./features/api/veiculos/veiculoApiSlice";
import Login from "./componentes/LoginRegistration/Login";
import { getUserInfo, keepUserInfo } from "./features/api/user/apiUserSlice";
import PrestadorList from "./componentes/Prestadores/PrestadorList";
import PerfilPrestador from "./componentes/Prestadores/PerfilPrestador";
import FormPrestador from "./componentes/Prestadores/FormPrestador";
import PerfilRegistro from "./componentes/Servicos/PerfilRegistro";
import ArticleIcon from '@mui/icons-material/Article';
import Registros from "./componentes/Registros/Registros";

const App = () => {
  const [token, setToken] = useState("")
  const prestadores = useSelector(state => state.prestador.prestadores)
  const prestadoresStatus = useSelector(getStatus);
  const { data: tokenObject } = useGetTokenQuery(token)
 const user = useSelector(getUserInfo)
 const [logoutApp] = useLogoutAppMutation()
 const [isLogado, setIsLogado] = useState(null)
 const [getLogin] = useGetLoginMutation()
 const dispatch = useDispatch(); 

 const {
   data: moradores,
   isLoading: isLoadingMoradores,
   isSuccess: isSuccessMoradores,
   isError: isErrorMoradores,
   error: errorMoradores,
   refetch: refetchMoradores
   } = useGetMoradoresQuery({ token });
   
   const {
     data: veiculos,
     isLoading: isLoadingVeiculos,
     isSuccess: isSuccessVeiculos,
     isError: isErrorVeiculos,
     error: errorVeiculos,
     refetch: refetchVeiculos,
     } = useGetVeiculosQuery({ token })
     
  useEffect(() => {
     if(tokenObject){
      setToken(old => tokenObject.token)
    } 
    if (isLogado === false) {
      refetchMoradores();
      refetchVeiculos()
    } 
    if (prestadoresStatus === "idle") {
      dispatch(fetchPrestadores(token));
    }
  }, [dispatch, prestadoresStatus, token, tokenObject, isLogado, refetchMoradores, refetchVeiculos]); 



  const [login, setLogin] = useState({ email: "", password: "" });

  const makeLogin = async (e) => {
    e.preventDefault();
    dispatch((keepUserInfo()))
    console.log("DATA : ", login);
    const { data: t } = await getLogin(login);
    if (t.token !== null && t.token !== "") {
      console.log("Login : ", t);
      setToken(t.token)
      setIsLogado(true)
      return;
    }
    window.alert("Login não confere");
  }
  const makeLogout = async (e) => {
    const t = dispatch((logoutApp))

    if (t.token === undefined) {
      setToken("")
      setIsLogado(false)
    }
  }

  const handleDelete = (id, token) => {
      dispatch(deletePrestador({ id, token }));
      navigate("/prestadores");
    };

  return (
    <div className="container-app">
      <div className="area-menu">
        <header className="header-logo" >
          <MapsHomeWorkIcon></MapsHomeWorkIcon> |
          <Link style={{ color: "white" }} to={"/"}>
            <p>SunShine Residence</p>
          </Link>

        </header>

        <ul className="menu">
          <li>
            <DirectionsBikeIcon></DirectionsBikeIcon>
            <Link to={"/prestadores"}>Prestadores</Link>
          </li>
          <li>
            <PeopleAltIcon></PeopleAltIcon>
            <Link to={"/moradores"}>Moradores</Link>
          </li>
          <li>
            <DirectionsCarFilledIcon></DirectionsCarFilledIcon>
            <Link to={"/veiculos"}>Veiculos</Link>
          </li>
          <li>
            <ArticleIcon></ArticleIcon>
            <Link to={"/registros"}>Registros</Link>
          </li>
        </ul>
      </div>

      <section className="area-de-dados">
        <header className="header-area-de-dados">
          <p>Area Escolhida</p>
          {user ? (<button onClick={makeLogout}>Logout</button>) : user.username}
        </header>
        <div className="view-dados">
          <Routes>
                <Route path="/" element={<HomePage />}>
                <Route index element={<Login makeLogin={makeLogin} setLogin={setLogin} login={login} />} />
             <Route path={"prestadores"} element={<PrestadorPage token={token}/>}>
                <Route index element={<PrestadorList prestadores={prestadores}  token={token} />} />
                <Route path={"add-prestador"} element={<FormPrestador token={token}  />} />
                <Route path={"update-prestador/:idPrestador"} element={<FormPrestador token={token} prestadores={prestadores} />} />
                <Route path={"perfil-prestador/:idPrestador"} element={<PerfilPrestador token={token}  handleDelete={handleDelete}/>} />
                <Route path="perfil-veiculo/:id" element={<PerfilVeiculo token={token} />} />           
              </Route> 

                
              <Route path="moradores/" element={<MoradorLayout token={token} />}>
                <Route index element={<MoradoresList moradores={moradores} isLoading={isLoadingMoradores} isSuccess={isSuccessMoradores} error={errorMoradores} isError={isErrorMoradores} setLogado={setIsLogado} isLogado={isLogado} token={token} />} />
                <Route path="add-morador/" element={<FormMoradores token={token} />} />
                <Route path="perfil/:id" element={<PerfilMorador token={token} />} />
                <Route path="update-morador/:id" element={<FormMoradores token={token} />} />
              </Route>
              <Route path="veiculos">
                <Route index element={<Veiculos refetch={refetchVeiculos} isLogado={isLogado} veiculos={veiculos} isLoading={isLoadingVeiculos} isSuccess={isSuccessVeiculos} error={errorVeiculos} isError={isErrorVeiculos} token={token} />} />
                <Route path="perfil-veiculo/:id" element={<PerfilVeiculo token={token} />} />
              </Route> 
              <Route path="registros">
                <Route index element={<Registros />} />
                <Route path="perfil-veiculo/:id" element={<PerfilVeiculo token={token} />} />
                <Route path={"registrar-entrada/:idPrestador"} element={<RegistrarEntrada token={token} />} />
                <Route path={"detalhes-do-registro/:idRegistro"} element={<PerfilRegistro token={token} />} /> 
              </Route> 
              {/* 
              */}
            </Route>
          </Routes>
        </div>
      </section>
    </div>
  );
}

export default App;
