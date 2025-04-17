import React, { useContext } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../features/api/context/AuthProvider';
import { useGetVeiculoPeloIdQuery } from '../../features/api/veiculos/veiculoApiSlice';

const PerfilVeiculo = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();

  const { data: veiculo, isLoading, isError } = useGetVeiculoPeloIdQuery({ token, id });

  if (isLoading) return <p className="text-center text-gray-300 mt-10">Carregando veículo...</p>;
  if (isError || !veiculo) return <p className="text-center text-red-400 mt-10">Erro ao carregar veículo.</p>;

  const { marca, modelo, cor, placa, foto, motorista } = veiculo;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white px-4">
      <div className="bg-[#1E1E1E] rounded-2xl shadow-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          <img
            src={foto || '/logo192.png'}
            alt={`Foto do veículo ${placa}`}
            className="w-48 h-48 object-cover rounded-lg border border-gray-700"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Informações do Veículo</h2>
            <p><span className="text-gray-400">Marca:</span> <code>{marca}</code></p>
            <p><span className="text-gray-400">Modelo:</span> <code>{modelo}</code></p>
            <p><span className="text-gray-400">Cor:</span> <code>{cor}</code></p>
            <p><span className="text-gray-400">Placa:</span> <code>{placa}</code></p>
          </div>
          <div className="w-full border-t border-gray-600 mt-4 pt-4">
            <h3 className="text-center text-lg font-medium mb-2">Proprietário</h3>
            {!motorista ? (
              <p className="text-center text-gray-400">Carregando proprietário...</p>
            ) : (
              <p className="text-center">
                <code>{motorista.nome}</code><br />
                <code>Apto {motorista.apartamento} - Bloco {motorista.bloco}</code>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilVeiculo;
