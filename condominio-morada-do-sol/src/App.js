	import React from "react";
import "./App.css";


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

import RegistrarEntrada from "./componentes/Registros/RegistrarEntrada";
import Login from "./componentes/LoginRegistration/Login";

import PrestadorList from "./componentes/Prestadores/PrestadorList";
import PerfilPrestador from "./componentes/Prestadores/PerfilPrestador";
import FormPrestador from "./componentes/Prestadores/FormPrestador";
import ArticleIcon from '@mui/icons-material/Article';
import Registros from "./componentes/Registros/Registros";
import PerfilRegistro from "./componentes/Registros/PerfilRegistro";



const App = () => { 
/*  const dispatch = useDispatch();
  const makeLogout = async (e) => {
    const t = dispatch((logoutApp))
    
  } */
  
 

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
          {/* {user ? (<button onClick={makeLogout}>Logout</button>) : user.username} */}
        </header>
        <div className="view-dados">
          <Routes>
                <Route path="/" element={<HomePage />}>
                <Route index element={<Login />} />
             <Route path={"prestadores"} element={<PrestadorPage/>}>
                <Route index element={<PrestadorList  />} />
                <Route path={"add-prestador"} element={<FormPrestador  />} />
                <Route path={"update-prestador/:idPrestador"} element={<FormPrestador />} /> 
                <Route path={"perfil-prestador/:idPrestador"} element={<PerfilPrestador  />} />
                <Route path="perfil-veiculo/:id" element={<PerfilVeiculo  />} />           
              </Route> 

                
              <Route path="moradores/" element={<MoradorLayout  />}>
                <Route index element={<MoradoresList />} />
                <Route path="add-morador/" element={<FormMoradores />} />
                <Route path="perfil/:id" element={<PerfilMorador  />} />
                <Route path="update-morador/:id" element={<FormMoradores  />} />
              </Route>
              <Route path="veiculos">
                <Route index element={<Veiculos  />} />
                <Route path="perfil-veiculo/:id" element={<PerfilVeiculo  />} />
              </Route> 
              <Route path="registros">
                <Route index element={<Registros />} />
                <Route path="perfil-veiculo/:id" element={<PerfilVeiculo  />} />
                <Route path={"registrar-entrada/:idPrestador"} element={<RegistrarEntrada />} />
                <Route path={"detalhes-do-registro/:idRegistro"} element={<PerfilRegistro />} /> 
              </Route> 
              
            </Route>
          </Routes>
        </div>
      </section>
    </div>
  );
}

export default App;
