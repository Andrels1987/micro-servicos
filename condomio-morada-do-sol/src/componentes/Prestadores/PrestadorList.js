import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BtnAdicionar from "../Outros/BtnAdicionar";

const PrestadorList = ({ prestadores }) => {
  
  const [modoBusca, setModoBusca] = useState('nome');
  const [prestador, setPrestador] = useState({nome: "", numeroDocumento: ""});
  const [listaPrestadores, setListaPrestadores] = useState([]);
  const [msgNaoEncontrado, setmsgNaoEncontrado] = useState("")


  
   const filtrarPrestador = () =>{
     let Rprestadores = prestadores.filter(item => 
      (prestador.nome && item.nome.includes(prestador.nome)) || 
      (prestador.numeroDocumento && item.numeroDocumento.includes(prestador.numeroDocumento))
    );
    
    if(Rprestadores.length === 0 && prestador.nome !== "" || Rprestadores.length === 0 && prestador.numeroDocumento !== "" ){
      setmsgNaoEncontrado(`Nenhum prestador com esse ${modoBusca}`)
    }else{
      setmsgNaoEncontrado("")
    }
    setListaPrestadores(Rprestadores.length === 0 ? prestadores : Rprestadores);
    
  }
    

  useEffect(() => {
    
    if(prestadores.length > 0 || prestador.nome === ""){
      setListaPrestadores(prestadores)
    }
    if(prestadores.nome !== "" && prestadores.numeroDocumento !== ""){
      filtrarPrestador();
    }
  }, [prestador, prestadores]) 
  
const atualizarFiltro = (valor) => {
  setPrestador(prev => ({
    nome : modoBusca === "nome" ? valor : "",
    numeroDocumento : modoBusca === "documento" ? valor : ""
  }))
}
  

  return (
    <div className="form">
      <div data-testid="modo-busca" className='modo-busca'>
        <label htmlFor="select">Modo de busca</label>
        <select aria-label="selecteModoBusca"onChange={(e) => setModoBusca(e.target.value)} value={modoBusca} name="select" id="select">
          <option value="nome">Nome</option>
          <option value="documento">RG/CPF</option>
        </select>
      </div>
      
      <form action="" aria-label="form-modo-busca">
        {modoBusca === 'nome' ? (
          <div>
            <input name="nome" id="nome" type="text" placeholder='Nome do prestador' onChange={(e) => atualizarFiltro(e.target.value)}  />
          </div>
        ) : (
          <div>
            <div>
              <input type="text" name="documento" id="documento" placeholder='Documento'   onChange={(e) => atualizarFiltro(e.target.value)}  />
            </div>
          </div>
        )}
      </form>
      <small style={{color: 'rgba(234, 112, 82, 0.78)', fontStyle: 'italic'}}>{msgNaoEncontrado}</small>
      <section className="dados">
        <div className="lista-de-prestadores">
        <div className="legenda">
          <p className="imagem">Foto</p>
          <p className="prestador-nome">Nome</p>
          <p className="empresa">Empresa</p>
          <p className="documento">documento</p>
        </div>
        {listaPrestadores.length === 0 ? (
          <h1>Nenhum prestador encontrado</h1>
        ) : (
          listaPrestadores.map((prestador) => (
            <div data-testid="prestador" className="prestador" key={prestador.id}>
            
              <Link data-testid="prest-profile" to={`perfil-prestador/${prestador.id}`}>                    
              <div  className={`info`} >
                  <div className="img">
                  <img
                    src={prestador.foto ? prestador.foto : "./logo192.png"}
                    alt="foto"
                  />                  
                  </div>
                  <p className="prestador-nome">{prestador.nome}</p>
                  <p className="empresa"><code>{prestador.empresa}</code></p>
                  <p className="documento"><code>{prestador.numeroDocumento}</code></p>                  
                </div>
              </Link>    

            </div>
          ))
        )}
        </div>
      </section>

        <div className="btn-adicionar">
          <BtnAdicionar  link={"add-prestador"}/>
        </div>

    </div>
  );
};

export default PrestadorList;
