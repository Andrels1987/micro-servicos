import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Loading from '../../Loading';
import { AuthContext } from '../../features/api/context/AuthProvider';
import { useGetVeiculosQuery } from '../../features/api/veiculos/veiculoApiSlice';

const Veiculos = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const listRef = useRef(null);

  const [searchInput, setSearchInput] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  const {
    data: veiculos,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetVeiculosQuery({ token }, { skip: !token });

  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo(0, 0);
    });
  }, []);

  const handleSearch = useCallback(() => {
    if (!veiculos) return;
    const normalizedSearch = searchInput.trim().toLowerCase();
    const filtered = veiculos.filter((v) =>
      v.placa.toLowerCase().includes(normalizedSearch)
    );
    setFilteredVehicles(filtered);
  }, [searchInput, veiculos]);

  useEffect(() => {
    if (!searchInput) {
      setFilteredVehicles(veiculos || []);
    } else {
      handleSearch();
    }
  }, [searchInput, veiculos, handleSearch]);

  useEffect(() => {
    if (isError) {
      setFilteredVehicles([]);
      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isError, navigate]);

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="veiculos-erro">
        {error?.status || 'Erro desconhecido'}. Redirecionando em {redirectCountdown}s...
      </p>
    );

  return (
    <div className="veiculos-container">
      <section className="veiculos-busca">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            id="placa"
            name="placa"
            placeholder="Digite a placa do veículo"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="veiculos-input"
          />
        </form>
      </section>

      <div ref={listRef} className="veiculos-lista">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((v) => (
            <Link
              to={`perfil-veiculo/${v._id}`}
              key={v._id}
              className="veiculo-card"
            >
              <h3>{`${v.marca} ${v.modelo}`}</h3>
              <p><strong>Cor:</strong> {v.cor}</p>
              <p><strong>Placa:</strong> {v.placa}</p>
            </Link>
          ))
        ) : (
          <div className="veiculo-nao-encontrado">
            Nenhum veículo encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default Veiculos;
