import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { postPrestador, updatePrestador } from "../../features/api/prestadores/apiPrestadorSlice";
import Profile from "../Profile";
//import { useGetTokenQuery } from "../../features/api/moradores/apiSliceMoradores";
import { useParams } from "react-router";


const modeloPrestador = {
  nome:"", 
  sobrenome: "", 
  empresa: "", 
  numeroDocumento:"", 
  foto: "", 
  idVeiculo:"",
  servicoPrestado: ""
}
const Formprestador = ({ prestadores }) => {
  const {idPrestador} = useParams();
  const [newPrestador, setNewPrestador] = useState(modeloPrestador);
  const dispatch = useDispatch();
 // const { data: tokenObject } = useGetTokenQuery("")

  useEffect(() => {
    let e = {};
    if(idPrestador && newPrestador.nome === ""  ){
      e = [...prestadores].find(item => item.id === idPrestador)     
      setNewPrestador(old => e)     
    }
  }, [newPrestador,prestadores, idPrestador]);
  

  const handleSave = (e) => {
    e.preventDefault();
    if(idPrestador){
      dispatch(updatePrestador({prestador: newPrestador}));
    }else{
      dispatch(postPrestador({prestador: newPrestador}));
      setNewPrestador(modeloPrestador);
    }
  };
  
  
 
  /* const salvarFoto = (e) => {
    e.preventDefault();
    setNewprestador({ ...newprestador, foto: newprestador.foto })
  } */
  const canSave =
    newPrestador.nome &&
    newPrestador.empresa &&
    newPrestador.numeroDocumento &&
    newPrestador.foto &&
    newPrestador.servicoPrestado;

    const addVeiculo = (e) => {
      e.preventDefault();
      console.log("adicionar veiculo");
      
    }

  //HANDLE SUBMIT
  return (
    <section className='prestadorForm ' style={{ color: "white" }}>
      <div className="profile">
        <section className="foto_prestador">
          <Profile setData={setNewPrestador} data={newPrestador} />
        </section>
      </div>
      <form action="" className="form-add-prestador">

      <div className="btn-add">
          <button className="btn-add-veiculo" onClick={(e) => addVeiculo(e)}>Adicionar Veiculo</button>
        </div>  
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            onChange={(e) =>
              setNewPrestador({ ...newPrestador, nome: e.target.value })
            }
            value={newPrestador.nome || ""}
          />
        </div>
        <div>
          <label htmlFor="sobrenome">Sobrenome</label>
          <input
            type="text"
            id="sobrenome"
            name="sobrenome"
            onChange={(e) =>
              setNewPrestador({ ...newPrestador, sobrenome: e.target.value })
            }
            value={newPrestador.sobrenome || ""}
          />
        </div>
        <div>
          <label htmlFor="empresa">Empresa</label>
          <input
            type="text"
            id="empresa"
            name="empresa"
            onChange={(e) =>
              setNewPrestador({ ...newPrestador, empresa: e.target.value })
            }
            value={newPrestador.empresa || ""}
          />
        </div>
        <div>
          <label htmlFor="documento">RG/CPF</label>
          <input
            type="text"
            id="documento"
            name="documento"
            onChange={(e) =>
              setNewPrestador({
                ...newPrestador,
                numeroDocumento: e.target.value,
              })
            }
            value={newPrestador.numeroDocumento || ""}
          />
        </div>   
        <div>
          <label htmlFor="servicoPrestado">Serviço</label>
          <input
            type="text"
            id="servicoPrestado"
            name="servicoPrestado"
            onChange={(e) =>
              setNewPrestador({
                ...newPrestador,
                servicoPrestado: e.target.value,
              })
            }
            value={newPrestador.servicoPrestado || ""}
          />
        </div>   
         
          
            <button className="salvar-prestador"
              onClick={(e) => handleSave(e)}
              disabled={!canSave}>
              Salvar Prestador
            </button>
      </form>

    </section>
  );
};

export default Formprestador;