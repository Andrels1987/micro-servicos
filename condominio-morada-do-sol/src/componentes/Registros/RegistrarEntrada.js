import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { nanoid } from "@reduxjs/toolkit";

import {
  Box,
  Typography,
  Avatar,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  InputLabel,
  FormControl,
} from "@mui/material";

import { useGetMoradoresQuery } from "../../features/api/moradores/apiSliceMoradores";
import { useAddServicoPrestadoMutation } from "../../features/api/servicos/apiServicosPrestados";
import { fetchPrestadores, getPrestadorPeloId } from "../../features/api/prestadores/apiPrestadorSlice";


// theme.js ou theme.ts
import { createTheme } from '@mui/material/styles';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { pointer } from "@testing-library/user-event/dist/cjs/pointer/index.js";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // azul claro
    },
    secondary: {
      main: '#f48fb1', // rosa
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          color: '#fff',
        },
        icon: {
          color: '#90caf9',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          '&:hover': {
            backgroundColor: '#2c2c2c',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#90caf9',
        },
      },
    },
  },
});




const RegistrarEntrada = () => {
  const { idPrestador: id } = useParams();

  const prestador = useSelector((state) => getPrestadorPeloId(state, id));
  const { data: moradores, error, isError } = useGetMoradoresQuery();
  const [addServico] = useAddServicoPrestadoMutation();

  const [modoBusca, setModoBusca] = useState("nome");
  const [morador, setMorador] = useState({ nome: "", apartamento: "", bloco: "" });
  const [tipoDeServico, setTipoDeServico] = useState("");
  const [observacaoSobreServico, setObservacaoSobreServico] = useState("");
  const [moradorFiltrado, setMoradorFiltrado] = useState([]);
  const [moradorEscolhido, setMoradorEscolhido] = useState({});
  const dispatch = useDispatch()


  const procurarMorador = useCallback(() => {
    let mf = [];
    if (modoBusca === "nome") {
      mf = moradores.filter((m) => m.nome.includes(morador.nome));
    } else {
      const pattern = `^${morador.apartamento}`;
      mf = moradores.filter(
        (m) => m.apartamento.match(pattern) && m.bloco.includes(morador.bloco)
      );
    }
    setMoradorFiltrado(mf);
  }, [modoBusca, morador, moradores]);

  useEffect(() => {
    if (morador.nome !== "" || morador.apartamento !== "" || morador.bloco !== "") {
      procurarMorador();
    }
  }, [morador, procurarMorador]);

  useEffect(() => {
    if(!prestador){
      dispatch(fetchPrestadores());
    }
    
  }, [dispatch]);
  

  


  console.log(tipoDeServico, " ", observacaoSobreServico);



  const finalizarRegistroDePrestacaoDeServico = () => {
    
    const entregaServico = {
      idPrestadorDeServico: prestador.id,
      idMorador: moradorEscolhido.id,
      tipoDeServico,
      observacaoSobreServico,
    };

    addServico({ entregaServico });
  };


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box p={1} maxWidth={1000} margin="auto">
        <Paper elevation={3} sx={{ p: 1, mb: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar src={prestador?.foto || "../../logo192.png"} sx={{ width: 30, height: 30 }} />
            </Grid>
            <Grid item>
              <Typography variant="h6">{prestador?.nome || "Fulano"}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Buscar Morador 
            <small style={{marginLeft: '1em',color: "#D6423D", fontSize: 'small'}}>{isError && error.status === "FETCH_ERROR" ? "Erro ao carregar moradores": ""}</small></Typography>
          
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel data-testid="modo-de-busca">Modo de busca</InputLabel>
            <Select
              sx={{
                pointerEvents: "stroke",
                height: 30, // controla a altura do select
                fontSize: '0.8em',
                '.MuiSelect-select': {
                  py: 0.1, // padding vertical interno
                }
              }}
              inputProps={
                {'data-testid': "select"}
              }
              size="small"
              MenuProps={{
                PaperProps: {
                  sx: {
                    // estiliza o container do menu
                    maxHeight: 200,
                    '& .MuiMenuItem-root': {
                      py: 1, // padding vertical menor
                      minHeight: '1px', // altura mínima reduzida
                      fontSize: '0.8rem'
                    }
                  }
                }
              }} value={modoBusca} label="Modo de busca" onChange={(e) => setModoBusca(e.target.value)}>
              <MenuItem value="nome">Nome</MenuItem>
              <MenuItem value="apartamento/bloco">Apartamento-Bloco</MenuItem>
            </Select>
          </FormControl>

          {modoBusca === "nome" ? (
            <TextField
              sx={{
                'data-testid': "input-nome-morador"
              }}
              fullWidth              
              label="Nome do morador"
              onChange={(e) => setMorador({ ...morador, nome: e.target.value })}
            />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Apartamento"
                  value={morador.apartamento || ""}
                  onChange={(e) => setMorador({ ...morador, apartamento: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Bloco"
                  value={morador.bloco || ""}
                  
                  onChange={(e) => setMorador({ ...morador, bloco: e.target.value })}
                />
              </Grid>
            </Grid>
          )}

          {moradorFiltrado.length > 0 && (
            <Box mt={3}>
              {moradorFiltrado.map((mf) => (
                <Paper data-testid="paper"
                  key={nanoid()}
                  sx={{
                    color: 'white',
                    p: 0.5,
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#e0e0e0", color: 'black' },
                  }}
                  onClick={() => setMoradorEscolhido({ ...mf })}
                >
                  <Typography m={1} sx={{ fontSize: '0.8em' }}>{mf.nome}</Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography sx={{ fontSize: 15 }} variant="h6" gutterBottom>Dados da Prestação de Serviço</Typography>

          <Typography data-testid="nome-morador" sx={{ fontSize: 12 }} variant="subtitle1">
            Nome: <strong>{moradorEscolhido.nome} {moradorEscolhido.sobrenome}</strong>
          </Typography>
          <Typography data-testid="bloco-apt" sx={{ fontSize: 12 }} variant="subtitle1">
            Apartamento: <strong>{moradorEscolhido.apartamento}</strong> | Bloco: <strong>{moradorEscolhido.bloco}</strong>
          </Typography>

          <TextField
            data-testid="servico"
            fullWidth
            label="Tipo de Serviço"
            sx={{ my: 1, mt: 1 }}
            value={tipoDeServico || ""}
            onChange={(e) => setTipoDeServico(e.target.value)}
          />

          <TextField
            data-testid="observacao"
            sx={{
              mt: 1
            }}
            fullWidth
            multiline
            rows={1}
            label="Observações"
            value={observacaoSobreServico || ""}
            onChange={(e) => setObservacaoSobreServico(e.target.value )}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={finalizarRegistroDePrestacaoDeServico}
          >
            Confirmar Entrada
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default RegistrarEntrada;
