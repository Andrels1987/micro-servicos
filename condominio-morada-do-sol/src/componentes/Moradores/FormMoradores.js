import React, { useEffect, useState } from "react";
import Profile from "../Profile";
import {
  useAddMoradorMutation,
  useGetMoradorPeloIdQuery,
  useUpdateMoradorMutation,
} from "../../features/api/moradores/apiSliceMoradores";
import { useParams, useNavigate } from "react-router-dom";

const moradorModelo = {
  id: "",
  nome: "",
  sobrenome: "",
  apartamento: "",
  bloco: "",
  foto: "",
  telefone: "",
  documento: "",
  veiculos: [],
  dependentes: [],
  criadoEm: null,
};

const FormMoradores = () => {
 
  const { id } = useParams();
  const navigate = useNavigate()
  const [morador, setMorador] = useState(moradorModelo);
  const [addMorador] = useAddMoradorMutation();
  const [updateMorador] = useUpdateMoradorMutation();
  const { data: fetchedMorador } = useGetMoradorPeloIdQuery(id);

  useEffect(() => {
    if (fetchedMorador) {
      const veiculos = fetchedMorador.veiculos || [];
      const veiculoIds = veiculos.map(veiculo => veiculo._id);
      setMorador({ ...fetchedMorador, veiculos: veiculoIds });
    }
  }, [fetchedMorador]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMorador(prev => ({ ...prev, [name]: value }));
  };

  console.log(fetchedMorador);
  
  const handleCriarMorador = async (e) => {
    e.preventDefault();

    if (!morador.nome || !morador.sobrenome || !morador.apartamento || !morador.bloco) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (id) {

        await updateMorador(morador).unwrap();
        alert("Morador atualizado com sucesso.");
        navigate("/moradores")
      } else {
        await addMorador(morador).unwrap();
        alert("Morador criado com sucesso.");
      }
    } catch (err) {
      console.error("Erro ao salvar morador:", err);
      alert("Ocorreu um erro ao salvar os dados.");
    }
  };

  return (
    <form className="form-moradores">
      <div className="infos-morador">
        <div className="card-campos">
          <CreateInputFields name="nome" placeholder="Nome" value={morador.nome} onChange={handleInputChange} />
          <CreateInputFields name="sobrenome" placeholder="Sobrenome" value={morador.sobrenome} onChange={handleInputChange} />
          <CreateInputFields name="apartamento" placeholder="Apartamento" value={morador.apartamento} onChange={handleInputChange} />
          <CreateInputFields name="bloco" placeholder="Bloco" value={morador.bloco} onChange={handleInputChange} />
          <CreateInputFields name="telefone" placeholder="Telefone" value={morador.telefone} onChange={handleInputChange} />
          <CreateInputFields name="documento" placeholder="Documento" value={morador.documento} onChange={handleInputChange} />
        </div>

        <section className="foto_morador">
          <Profile setData={setMorador} data={morador} />
        </section>
      </div>

      <button className="btn btn-light" type="button" onClick={handleCriarMorador}>
        Salvar Morador
      </button>
    </form>
  );
};

const CreateInputFields = ({ name, placeholder, value, onChange }) => (
  <div className="campos">
    <input
      type="text"
      name={name}
      id={name}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
    />
  </div>
);

export default FormMoradores;
