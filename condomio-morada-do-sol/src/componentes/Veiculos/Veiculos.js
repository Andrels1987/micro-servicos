import React, { useEffect, useRef, useState } from 'react'
import Loading from '../../Loading'
import { Link, useNavigate } from 'react-router-dom';

const Veiculos = ({ 
    veiculos,
    error,
    isSuccess,
    isLoading,
    isError,
    isLogado,
    refetch
}) => {

    

    const navigate = useNavigate()
    const [veiculo, setVeiculo] = useState({})
    const [contador, setContador] = useState(3)
    const [veiculoFiltrado, setVeiculoFiltrado] = useState([])
    const listaveiculosRef = useRef(null);

    useEffect(() => {
        const scrollToTop = () =>{
            if(listaveiculosRef.current){
                console.log("REF ", listaveiculosRef.current);
                
                listaveiculosRef.current.scrollTop = 0;
            }
        };
        if (error || isLogado === false) {
            setVeiculoFiltrado([]);
            const timer = setInterval(() => {
                setContador(contador - 1)
                if(contador === 0) {
                    navigate("/")
                }
            }, 1000);
            return ()=> clearInterval(timer)
        }
        if (veiculos) {
            if (veiculo.placa === undefined || veiculo.placa === '') {
                setVeiculoFiltrado([...veiculos])
                return;
            }
            handleSearch();
        }
        //refetch();
        requestAnimationFrame(scrollToTop);
    }, [error, veiculo, isLogado, contador, veiculos]);

    const handleSearch = () => {
        if (veiculo.placa !== '') {
            //moradoresFiltro = moradores.filter(mo => mo.nome.includes(morador.nome))
            setVeiculoFiltrado([...veiculos.filter(v => v.placa.includes(veiculo.placa))])
        }
    }
  

    let content;
    if (isLoading) {
        content = <Loading />
    } else if (isSuccess) {
        content =
            <div className='veiculos-page'>
                <section className='procurar-veiculo'>
                    <form action="">
                        <div>
                            <input
                            placeholder='Digite a placa do veiculo' 
                            type="text" name='placa' id='placa' onChange={(e) => setVeiculo({ ...veiculo, placa: e.target.value })} />
                        </div>
                    </form>
                </section>
                <div ref={listaveiculosRef} className='listaveiculos'>
                    {veiculoFiltrado.length > 0 ? (veiculoFiltrado.map(v => (
                        <div className='item-veiculo' key={v._id} >
                            <Link to={`perfil-veiculo/${v._id}`}><h3 className=''>{v.marca} | {v.modelo} | {v.cor} | {v.placa} </h3></Link>
                        </div>
                    ))) : (
                        <div >
                           Usuario deslogou. Redirecionando em {contador}
                        </div>
                    )}
                </div>
                <div className='add-morador'>
                <Link to={"add-morador"}>add</Link>
            </div>
            </div>
    } else if (isError) {
        content = <p>{error.status} Sem autorização</p>
    }
    return (
        <>
            {content}
            
        </>
    )
}

export default Veiculos