import React, { useEffect, useState } from "react";
import Profile from "../Profile";
import { useAddMoradorMutation, useGetMoradorPeloIdQuery, useUpdateMoradorMutation } from "../../features/api/moradores/apiSliceMoradores";
import { useParams } from "react-router";


const moradorModelo = {
  "id": "",
  "nome": "",
  "sobrenome": "",
  "apartamento": "",
  "bloco": "",
  "foto": "",
  "telefone": "",
  "documento": "",
  "veiculos": [],
  "dependentes": [],
  "criadoEm": null
}



const FormMoradores = ({ token }) => {
  const {id} = useParams()
  const [morador, setMorador] = useState(moradorModelo);
  const [addMorador] = useAddMoradorMutation()
  const [updateMorador] = useUpdateMoradorMutation()
  const {data: fetchedMorador} = useGetMoradorPeloIdQuery({token, id});


useEffect(() => {
  if(fetchedMorador){
    let ids = []
    let veiculos = fetchedMorador.veiculos;
    if(veiculos !== null){
      for(let veiculo of veiculos){
        ids.push(veiculo._id);
      }          
    }
    setMorador({...fetchedMorador, veiculos: ids});
  }
}, [])


  const handleCriarMorador = (e) => {
    e.preventDefault()
    if(id){
      updateMorador({morador})
    }else{
      addMorador({ morador, token })

    }

  }
console.log("Morador : ", morador);


  return (

    <form className="form-moradores" action="">
      <div className="infos-morador">
        <div className="card-campos" >
          <div className="campos nome">
            <input
              placeholder="nome"
              type="text"
              name="nome"
              id="nome"
              value={morador.nome || ""}
              onChange={(e) => setMorador({ ...morador, nome: e.target.value })}
            />
          </div>

          <div className="campos sobrenome">
            <input
              placeholder="sobrenome"
              type="text"
              name="sobrenome"
              id="sobrenome"
              value={morador.sobrenome || ""}
              onChange={(e) =>
                setMorador({ ...morador, sobrenome: e.target.value })
              }
            />
          </div>

          <div className="campos apartamento">
            <input
              placeholder="apartamento"
              type="text"
              name="apartamento"
              id="apartamento"
              value={morador.apartamento || ""}
              onChange={(e) =>
                setMorador({ ...morador, apartamento: e.target.value })
              }
            />
          </div>

          <div className="campos bloco">
            <input
              placeholder="bloco"
              type="text"
              name="bloco"
              id="bloco"
              value={morador.bloco || ""}
              onChange={(e) =>
                setMorador({ ...morador, bloco: e.target.value })
              }
            />
          </div>

          <div className="campos telefone">
            <input
              placeholder="telefone"
              type="text"
              name="telefone"
              id="telefone"
              value={morador.telefone || ""}
              onChange={(e) =>
                setMorador({ ...morador, telefone: e.target.value })
              }
            />
          </div>
          <div className="campos doc">
            <input
              placeholder="documento"
              type="text"
              name="doc"
              id="doc"
              value={morador.documento || ""}
              onChange={(e) =>
                setMorador({ ...morador, documento: e.target.value })
              }
            />
          </div>

        </div>

        <section hidden={false} className="foto_morador">
          <section className="">
            <Profile setData={setMorador} data={morador} />
          </section>
        </section>
      </div>
      <button className="btn btn-light" name="criar" type="button" onClick={(e) => handleCriarMorador(e)}>Salvar Morador</button>
    </form>

  );
};

export default FormMoradores;
