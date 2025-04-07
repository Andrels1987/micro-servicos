import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loading from '../../Loading'
import BtnAdicionar from '../Outros/BtnAdicionar'
const MoradoresList = ({ isLoading, isSuccess, error, isError, isLogado, moradores }) => {

    const [morador, setMorador] = useState({})
    const [contador, setContador] = useState(5)
    const [moradoresFiltrados, setMoradoresFiltrados] = useState([])
    const [modoBusca, setModoBusca] = useState('nome');
    const navigate = useNavigate()      



    useEffect(() => {
        if (moradores) {
            if (isLogado === false) {
                setMoradoresFiltrados([])
                const timer = setInterval(() => {
                    setContador(contador - 1)
                    if (contador === 1) {
                        navigate("/");
                    }
                }, 1000);
                return () => clearInterval(timer)
            } else {
                setMoradoresFiltrados([...moradores])
            }

        }
        if (moradoresFiltrados.length > 0) {
            handleSearch()
        }

        if (error) {
            console.log("ERROR1 : ", error);
            setMoradoresFiltrados([])
            const timer = setInterval(() => {
                setContador(contador - 1)
                if (contador === 1) {
                    navigate("/");
                }
            }, 1000);
            return () => clearInterval(timer)       
        }
    }, [moradores, error, morador, isLogado, contador]);



    const mostratInfoMorador = (e) => {
        e.preventDefault();
        let parent = e.target.parentNode
        let listamoradores = parent.parentNode;
        let elements = listamoradores.getElementsByClassName("info")
        let showElement = parent.getElementsByTagName("div");
        for (let el of elements) {
            if (showElement[0] === el) {
                el.classList.toggle("show-info");
            } else {
                el.classList.remove("show-info");
            }
        }
    };

    const handleSearch = () => {
        if(modoBusca === 'nome'){
            if (morador.nome !== '') {
                //moradoresFiltro = moradores.filter(mo => mo.nome.includes(morador.nome))
                setMoradoresFiltrados([...moradores.filter(mo => mo.nome.includes(morador.nome))])
            }
        }else{
            setMoradoresFiltrados([...moradores.filter(mo =>{
                console.log("AQUI");                
                return mo.apartamento.includes(morador.apartamento) && mo.bloco.includes(morador.bloco)
            })])
                
            }
        }
    
    

    let content;
    if (isLoading) {
        content = <Loading />
    } else if (isSuccess) {

        content =
            <div className='form'>
                <div className='modo-busca'>
                    <label htmlFor="nome">Modo de busca</label>
                    <select data-testid="select" onChange={(e) => setModoBusca(e.target.value)} value={modoBusca} name="" id="">
                        <option value="nome">Nome</option>
                        <option value="bloco-apartamento">Apartamento e bloco</option>
                    </select>
                </div>
                <form action="">
                    {modoBusca === 'nome' ? (
                        <div>
                            <input type="text" placeholder='Nome do morador' name='nome' id='nome' onChange={(e) => setMorador({ ...morador, nome: e.target.value })} />
                        </div>
                    ) : (
                        <div>
                            <div>
                                <input type="text" placeholder='Apartamento' name='apartamento' id='apartamento' onChange={(e) => setMorador({ ...morador, apartamento: e.target.value })} />
                            </div>
                            <div>
                                <input type="text" placeholder='Bloco' name='bloco' id='bloco' onChange={(e) => setMorador({ ...morador, bloco: e.target.value })} />
                            </div>
                        </div>
                    )}
                </form>""

                <section className='dados'>
                    <div className='lista-de-moradores'>
                        {moradoresFiltrados.length === 0 ?
                            (<p> Usuario deslogado : Voce sera redirecionado em {contador}</p>)
                            :
                            (moradoresFiltrados.map(morador => (
                                <div className="morador" data-testid="quantity" key={morador.id} >
                                   
                                        <p className='nome-morador' onClick={(e) => mostratInfoMorador(e)}>{morador.nome} {morador.sobrenome}</p>
                                        <p className="bloco">Bloco: <code>{morador.bloco}</code></p>
                                        <p className="apartamento">Apartamento: <code >{morador.apartamento}</code></p>
                                        <Link className='informacoes' to={`perfil/${morador.id}`}>Informações do morador</Link>
                                
                                </div>
                            )))}
                    </div>
                </section>
            </div>
    } else if (isError) {
        content = <p> Usuario deslogado. Voce será redirecionado em {contador}</p>
    }

    return (
        <div>
            {content}
            <div className='btn-adicionar'>
                <BtnAdicionar link={"add-morador"} />
            </div>
        </div>
    )
}

export default MoradoresList