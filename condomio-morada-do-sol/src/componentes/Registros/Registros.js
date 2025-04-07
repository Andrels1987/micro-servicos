import React, { useEffect, useState } from 'react'
import { useGetServicosPrestadosQuery } from '../../features/api/servicos/apiServicosPrestados'
import { format } from 'date-fns'
import { Link } from 'react-router';
const Registros = ({ token }) => {

    const [modoBusca, setModoBusca] = useState('data');
    const { data: todosOsRegistros } = useGetServicosPrestadosQuery({ token });
    const [blocoApt, setBlocoApt] = useState({ bloco: "", apartamento: "" })
    const [registros, setRegistros] = useState([])
    const [data, setData] = useState("")



    useEffect(() => {
        if (todosOsRegistros) {
            setRegistros(old => todosOsRegistros)
        }
        if (registros.length > 0) {
            handleSearch()
        }

    }, [todosOsRegistros, data, blocoApt])

    const handleSearch = () => {
        if (modoBusca === 'data') {
            if (data !== '') {
                setRegistros([...todosOsRegistros.filter(r => r.dataInicioDoServico.includes(data))])
            }
        } else {
            setRegistros([...todosOsRegistros.filter(r => {
                if (r.apartamento !== null && r.bloco !== null) {
                    return r.apartamento.includes(blocoApt.apartamento) && r.bloco.includes(blocoApt.bloco)
                }
            })])

        }
    }

    const limitarNome = (nome) => {
        return nome.split(" ")[0];
    }
    const limitarData = (data) => {
        return format(new Date(data), "dd-MM-yyyy");
    
    }
console.log(registros);

    return (
        <div style={{ color: "white" }}>
            <div className='modo-busca'>
                <label htmlFor="nome">Modo de busca</label>
                <select onChange={(e) => setModoBusca(e.target.value)} value={modoBusca} name="" id="">
                    <option value="data">Data</option>
                    <option value="bloco-apartamento">Apartamento e bloco</option>
                </select>
            </div>
            <form action="">
                {modoBusca === 'data' ? (
                    <div>
                        <input type="text" placeholder='data do serviço' name='nome' id='nome' onChange={(e) => setData(e.target.value)} />
                    </div>
                ) : (
                    <div>
                        <div>
                            <input type="text" placeholder='Apartamento' name='apartamento' id='apartamento' onChange={(e) => setBlocoApt({ ...blocoApt, apartamento: e.target.value })} />
                        </div>
                        <div>
                            <input type="text" placeholder='Bloco' name='bloco' id='bloco' onChange={(e) => setBlocoApt({ ...blocoApt, bloco: e.target.value })} />
                        </div>
                    </div>
                )}
            </form>
            <div className='legenda'>
                <p className='morador'>Morador</p>
                <p className='apartamento'>Apartamento</p>
                <p className='bloco'>Bloco</p>
                <p className='prestador'>Prestador</p>
                <p className='entrada'>Entrada</p>
                <p className='saida'>Saida</p>
            </div>
            <section className='registros'>
                {registros && registros.map(registro => (
                    <Link key={registro.id} to={`./detalhes-do-registro/${registro.id}`}>
                    <div className='registro' >
                        <p className="morador">{registro.nomeMorador }</p>
                        <p className="apartamento">{registro.apartamento}</p> 
                        <p className="bloco">{registro.bloco}</p>
                        <p className="prestador">{limitarNome(registro.nomePrestador)}</p>
                        <p className='entrada'>{limitarData(registro.dataInicioDoServico)}</p>
                        <p className='saida'>{limitarData(registro.dataEncerramentoDoServico)}</p>
                    </div>
                    </Link>
                ))}

            </section>
        </div>
    )
}

export default Registros