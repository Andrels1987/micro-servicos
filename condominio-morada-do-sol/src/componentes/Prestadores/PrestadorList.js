import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../features/api/context/AuthProvider";
import { fetchPrestadores } from "../../features/api/prestadores/apiPrestadorSlice";
import BtnAdicionar from "../Outros/BtnAdicionar";

const PrestadorList = () => {
  const [modoBusca, setModoBusca] = useState("nome");
  const [busca, setBusca] = useState({ nome: "", numeroDocumento: "" });
  const [listaDePrestadores, setListaDePrestadores] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");

  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);
  const prestadores = useSelector((state) => state.prestador.prestadores);

  // Fetch ao carregar
  useEffect(() => {
    if (token) dispatch(fetchPrestadores(token));
  }, [dispatch, token]);

  // Função de filtro
  const aplicarFiltro = useCallback(() => {
    let resultado = [];

    if (modoBusca === "nome") {
      resultado = prestadores.filter((p) =>
        p.nome.toLowerCase().includes(busca.nome.toLowerCase().trim())
      );
    } else {
      resultado = prestadores.filter((p) =>
        p.numeroDocumento.includes(busca.numeroDocumento.trim())
      );
    }

    if (resultado.length === 0 && (busca.nome || busca.numeroDocumento)) {
      setMensagemErro(`Nenhum prestador com esse ${modoBusca}`);
    } else {
      setMensagemErro("");
    }

    setListaDePrestadores(busca.nome || busca.numeroDocumento ? resultado : prestadores);
  }, [modoBusca, busca, prestadores]);

  // Atualiza lista filtrada ao alterar busca ou prestadores
  useEffect(() => {
    if (prestadores.length > 0) {
      aplicarFiltro();
    }
  }, [busca, prestadores, aplicarFiltro]);

  const handleBuscaChange = (valor) => {
    setBusca((prev) => ({
      nome: modoBusca === "nome" ? valor : "",
      numeroDocumento: modoBusca === "documento" ? valor : "",
    }));
  };

  return (
    <div className="form">
      <div className="modo-busca" data-testid="modo-busca">
        <label htmlFor="select">Modo de busca</label>
        <select
          aria-label="selectModoBusca"
          id="select"
          value={modoBusca}
          onChange={(e) => setModoBusca(e.target.value)}
        >
          <option value="nome">Nome</option>
          <option value="documento">RG/CPF</option>
        </select>
      </div>

      <form aria-label="form-modo-busca">
        <input
          type="text"
          placeholder={modoBusca === "nome" ? "Nome do prestador" : "Documento"}
          value={modoBusca === "nome" ? busca.nome : busca.numeroDocumento}
          onChange={(e) => handleBuscaChange(e.target.value)}
        />
      </form>

      {mensagemErro && (
        <small style={{ color: "rgba(234, 112, 82, 0.78)", fontStyle: "italic" }}>
          {mensagemErro}
        </small>
      )}

      <section className="dados">
        <div className="lista-de-prestadores">
          <div className="legenda">
            <p className="imagem">Foto</p>
            <p className="prestador-nome">Nome</p>
            <p className="empresa">Empresa</p>
            <p className="documento">Documento</p>
          </div>

          {listaDePrestadores.length === 0 ? (
            <h1>Nenhum prestador encontrado</h1>
          ) : (
            listaDePrestadores.map((p) => (
              <div className="prestador" data-testid="prestador" key={p.id}>
                <Link to={`perfil-prestador/${p.id}`} data-testid="prest-profile">
                  <div className="info">
                    <div className="img">
                      <img
                        src={p.foto ? p.foto : "./logo192.png"}
                        alt="foto"
                      />
                    </div>
                    <p className="prestador-nome">{p.nome}</p>
                    <p className="empresa"><code>{p.empresa}</code></p>
                    <p className="documento"><code>{p.numeroDocumento}</code></p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="btn-adicionar">
        <BtnAdicionar link={"add-prestador"} />
      </div>
    </div>
  );
};

export default PrestadorList;
