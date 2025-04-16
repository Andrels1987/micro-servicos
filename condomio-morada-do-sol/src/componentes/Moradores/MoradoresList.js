import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Loading from '../../Loading';
import BtnAdicionar from '../Outros/BtnAdicionar';
import { AuthContext } from '../../features/api/context/AuthProvider';
import { useGetMoradoresQuery } from '../../features/api/moradores/apiSliceMoradores';

const MoradoresList = () => {
   
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [moradorBusca, setMoradorBusca] = useState({ nome: '', apartamento: '', bloco: '' });
    const [modoBusca, setModoBusca] = useState('nome');
    const [listaDeMoradores, setListaDeMoradores] = useState([]);
    const [contador, setContador] = useState(5);
    const [msg, setMsg] = useState("")

   
      
    const {
        data: moradores,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetMoradoresQuery({ token }, {skip: !token});

    // Atualiza a lista filtrada ao carregar os moradores
    useEffect(() => {
        if (moradores) {
            setListaDeMoradores(moradores);
        }
    }, [moradores]);

    //atualiza o contador
    useEffect(() => {
        if ((isError && error) || !token) {
            const timer = setInterval(() => {
                setContador(prev => {
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [error, token, isError]);

    // Lógica de busca e redirecionamento
    useEffect(() => {
        if (!moradores) return;

        const { nome, apartamento, bloco } = moradorBusca;
        const camposPreenchidos = nome || apartamento || bloco;

        if (camposPreenchidos) {
            filtrarMoradores();
        }

        
    }, [moradorBusca, moradores]);

    useEffect(() => {
        if (contador === 0) {
          navigate('/');
        }
      }, [contador, navigate]);

    const selectModoBusca = (e) => {
        setMsg("")
        setMoradorBusca({ nome: '', apartamento: '', bloco: '' })
        setModoBusca(e)
    }
    const filtrarMoradores = () => {
        
        if (!moradores) return;

        let filtrados = [];

        if (modoBusca === 'nome') {
            filtrados = moradores.filter(m => {
                const nomeCompleto = m.nome + " " + m.sobrenome;
                return nomeCompleto.toLowerCase().includes(moradorBusca.nome.trim().toLowerCase())
            });
            filtrados.length === 0 ? setMsg(`Nenhum morador com esse ${modoBusca}`) : setMsg("")
        } else {
            filtrados = moradores.filter(m =>
                m.apartamento.trim().includes(moradorBusca.apartamento.trim()) &&
                m.bloco.trim().includes(moradorBusca.bloco.trim())
            );
            filtrados.length === 0 ? setMsg(`Nenhum morador com esse ${modoBusca}`) : setMsg("")

        }

        setListaDeMoradores(filtrados.length > 0 ? filtrados : moradores);
    };

    const handleInputChange = (e) => {        
        const { name, value } = e.target;
        setMoradorBusca(prev => ({ ...prev, [name]: value }));
    };

    const renderFormularioBusca = () => {
        return modoBusca === 'nome' ? (
            <div>
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome do morador"
                    value={moradorBusca.nome}
                    onChange={handleInputChange}
                />
                <small style={{color: 'white', marginLeft: '1em'}}> {msg}</small>
            </div>
        ) : (
            <div>
                <input
                    type="text"
                    name="apartamento"
                    placeholder="Apartamento"
                    value={moradorBusca.apartamento}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="bloco"
                    placeholder="Bloco"
                    value={moradorBusca.bloco}
                    onChange={handleInputChange}
                />
                <small>{msg}</small>
            </div>
        );
    };

    const renderMoradores = () => {
        if (listaDeMoradores.length === 0) {
            return <p style={{color: 'white'}}>Nenhum morador encontrado.</p>;
        }

        return listaDeMoradores.map(({ id, nome, sobrenome, bloco, apartamento }) => (
            <div className="morador" data-testid="quantity" key={id}>
                <Link to={`perfil/${id}`}>
                <p className="nome-morador">{nome} {sobrenome}</p>
                <p className="bloco">Bloco: <code>{bloco}</code></p>
                <p className="apartamento">Apartamento: <code>{apartamento}</code></p>
                </Link>
            </div>
        ));
    };
   
    
    const renderErro = () => {
        if(!token) return <p style={{color: 'white'}}>Usuário deslogado. Você será redirecionado em {contador}...</p>;
        if (!error) return null;
        const mensagem = error.status === 'FETCH_ERROR'
            ? 'Serviço indisponível'
            : 'Usuário deslogado';
        return <p style={{color: 'white'}}>{mensagem}. Você será redirecionado em {contador}...</p>;
    };

    return (
        <div>
            {isLoading && <Loading />}

            {isSuccess && (
                <div className="form">
                    <div className="modo-busca">
                        <label htmlFor="modoBusca">Modo de busca</label>
                        <select
                            data-testid="select"
                            id="modoBusca"
                            value={modoBusca}
                            onChange={(e) => selectModoBusca(e.target.value)}
                        >
                            <option value="nome">Nome</option>
                            <option value="bloco-apartamento">Apartamento e bloco</option>
                        </select>
                    </div>

                    <form>
                        {renderFormularioBusca()}
                    </form>

                    <section className="dados">
                        <div className="lista-de-moradores">
                            {renderMoradores()}
                        </div>
                    </section>
                </div>
            )}

            {(!token || isError) && renderErro()}

            <div className="btn-adicionar">
                <BtnAdicionar link="add-morador" />
            </div>
        </div>
    );
};

export default MoradoresList;
