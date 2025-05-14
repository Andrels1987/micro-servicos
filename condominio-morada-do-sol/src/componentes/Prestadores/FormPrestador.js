import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPrestadorPeloId, postPrestador, updatePrestador } from "../../features/api/prestadores/apiPrestadorSlice";
import Profile from "../Profile";
import { useParams } from "react-router-dom";

// Modelo inicial do prestador
const modeloPrestador = {
  nome: "", 
  sobrenome: "", 
  empresa: "", 
  numeroDocumento: "", 
  foto: "", 
  idVeiculo: "",
  servicoPrestado: ""
};

const FormPrestador = () => {

  const { idPrestador } = useParams();
  const dispatch = useDispatch();

  const prestadorExistente = useSelector((state) => getPrestadorPeloId(state, idPrestador));
  const [prestador, setPrestador] = useState(modeloPrestador);

  useEffect(() => {
    if (prestadorExistente) {
      setPrestador(prestadorExistente);
    }
  }, [idPrestador, prestadorExistente]);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrestador((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idPrestador) {
      dispatch(updatePrestador({ newPrestador: prestador }));
    } else {
      dispatch(postPrestador({ prestador }));
      setPrestador(modeloPrestador);
    }
  };

  const handleAddVeiculo = (e) => {
    e.preventDefault();
  };

  const isFormValid = 
    prestador.nome &&
    prestador.empresa &&
    prestador.sobrenome &&
    prestador.numeroDocumento &&
    //prestador.foto &&
    prestador.servicoPrestado;

  return (
    <section className="prestadorForm" style={{ color: "white" }}>
      <div className="profile">
        <section className="foto_prestador">
          <Profile setData={setPrestador} data={prestador} />
        </section>
      </div>

      <form className="form-add-prestador" onSubmit={handleSubmit}>
        <div className="btn-add">
          <button className="btn-add-veiculo" onClick={handleAddVeiculo}>
            Adicionar Veículo
          </button>
        </div>

        <InputField placeholder={'nome'} label="Nome" name="nome" value={prestador.nome} onChange={handleInputChange} />
        <InputField placeholder={'sobrenome'} label="Sobrenome" name="sobrenome" value={prestador.sobrenome} onChange={handleInputChange} />
        <InputField placeholder={'empresa'} label="Empresa" name="empresa" value={prestador.empresa} onChange={handleInputChange} />
        <InputField placeholder={'documento'} label="RG/CPF" name="numeroDocumento" value={prestador.numeroDocumento} onChange={handleInputChange} />
        <InputField placeholder={'servico'} label="Serviço" name="servicoPrestado" value={prestador.servicoPrestado} onChange={handleInputChange} />

        <button type="submit" className="salvar-prestador" disabled={!isFormValid}>
          Salvar Prestador
        </button>
      </form>
    </section>
  );
};

//reduz repetição de codigo e melhora a legibilidade do JSX
const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input placeholder={placeholder} type="text" id={name} name={name} value={value || ""} onChange={onChange} />
  </div>
);

export default FormPrestador;
