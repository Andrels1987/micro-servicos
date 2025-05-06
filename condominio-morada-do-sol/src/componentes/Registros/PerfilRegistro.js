import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { useDispatch } from "react-redux";

import {
  useGetServicosPrestadosQuery,
  useRegistrarEncerramentoDoServicoMutation,
} from "../../features/api/servicos/apiServicosPrestados";
import { fetchPrestadores } from "../../features/api/prestadores/apiPrestadorSlice";

import {
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Button,
  Paper,
  Avatar
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function PerfilRegistro() {
  const { idRegistro } = useParams();
  const dispatch = useDispatch();

  const { data: servicosPrestados } = useGetServicosPrestadosQuery();
  const [registrarEncerramento] = useRegistrarEncerramentoDoServicoMutation();

  const [registro, setRegistro] = useState(null);

  useEffect(() => {
    if (!servicosPrestados) return;

    const encontrado = servicosPrestados.find(r => r.id === idRegistro);

    if (encontrado) {
      const {
        morador,
        prestador,
        dataEncerramentoDoServico,
        dataInicioDoServico,
        id,
        observacaoSobreServico,
        tipoDeServico,
      } = encontrado;

      const registroFormatado = {
        id,
        nomeMorador: morador?.nome || "*******",
        apartamento: morador?.apartamento || "****",
        bloco: morador?.bloco || "**",
        idMorador: morador?.id,
        nomePrestador: prestador?.nome,
        fotoPrestador: prestador?.foto || "",
        idPrestadorDeServico: prestador?.id,
        tipoDeServico,
        observacaoSobreServico,
        dataInicioDoServico: format(new Date(dataInicioDoServico), "dd-MM-yyyy HH:mm:ss"),
        dataEncerramentoDoServico: dataEncerramentoDoServico ? format(new Date(dataEncerramentoDoServico), "dd-MM-yyyy HH:mm:ss") : null,
      };

      setRegistro(registroFormatado);
    }
  }, [servicosPrestados, idRegistro]);

  useEffect(() => {
    if (servicosPrestados) {
      dispatch(fetchPrestadores());
    }
  }, [servicosPrestados, dispatch]);

  const registrarEncerramentoDoServico = async () => {
    try {
      await registrarEncerramento({ registro }).unwrap();
      alert("Serviço encerrado com sucesso!");
      setRegistro(prev => ({
        ...prev,
        dataEncerramentoDoServico: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
      }));
    } catch (error) {
      console.error("Erro ao registrar encerramento:", error);
      alert("Erro ao registrar encerramento do serviço.");
    }
  };

  
  if (!registro) return <Typography color="white">Carregando registro...</Typography>;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box p={3} display="flex" flexDirection="column" gap={2} maxWidth={600} margin="auto">
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Prestador de Serviço</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={registro.fotoPrestador} alt="Prestador" sx={{ width: 50, height: 50 }} />
            <Typography>{registro.nomePrestador}</Typography>
          </Box>
          <Button variant="outlined" component={Link} to={`../../prestadores/perfil-prestador/${registro.idPrestadorDeServico}`} sx={{ mt: 2 }}>
            Ver perfil do Prestador
          </Button>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Morador</Typography>
          <Typography>{registro.nomeMorador}</Typography>
          <Typography>Apt: {registro.apartamento} | Bloco: {registro.bloco.toUpperCase()}</Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Detalhes do Serviço</Typography>
          <Typography>Tipo: {registro.tipoDeServico}</Typography>
          <Typography>Observação: {registro.observacaoSobreServico}</Typography>
          <Typography>Entrada: {registro.dataInicioDoServico}</Typography>
          <Typography>Saída: {registro.dataEncerramentoDoServico || "-------"}</Typography>
        </Paper>

        <Button
          variant="contained"
          color="secondary"
          disabled={Boolean(registro.dataEncerramentoDoServico)}
          onClick={registrarEncerramentoDoServico}
        >
          Finalizar Serviço
        </Button>
      </Box>
    </ThemeProvider>
  );
}

export default PerfilRegistro;
