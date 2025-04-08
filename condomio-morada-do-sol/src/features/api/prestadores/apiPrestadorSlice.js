import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import moment from "moment/moment";
const url = process.env.REACT_APP_APP_BASE_URL_SERVICO_PRESTADOR;
export const fetchPrestadores = createAsyncThunk('prestadores/fetchPrestadores', async (token) => {
    console.log("TOKEN : ", token);
    
    try {
        const response = await axios.get(`${url}/prestadores`,
            {
                headers:
                {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
        const data = await response.data
        return [...data]
    } catch (error) {
        console.log(error);
    }
})

export const deletePrestador = createAsyncThunk('prestadores/deletePrestadores', async ({ id, token }) => {
  
    try {
        const response = await axios.delete(`${url}/delete/prestador/${id}`,
            {
                headers:
                {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
        const data = await response.data
        return data
    } catch (error) {
        console.log(error);
    }
})
export const postPrestador = createAsyncThunk('prestadores/postPrestadores', async ({ prestador, token }) => {
    console.log("EM POST : ", prestador);
    try {
        if (token !== null) {
            const criadoEm = new Date()
            prestador = { ...prestador, criadoEm }
            const response = await axios.post(`${url}/add/prestador`, prestador, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            //const response = await axios.post("http://192.168.1.105:8023/add/entregador", entregador);
            const data = await response.data
            console.log("DATA : ", data);
            return data
        } else {
            return {};
        }
    } catch (error) {
        console.log(error);
    }
})
export const updatePrestador = createAsyncThunk('prestadores/updatePrestador', async ({ prestador, token }) => {
    const entregadorData = {
        id: prestador.id,
        nome: prestador.nome,
        sobrenome: prestador.sobrenome,
        empresa: prestador.empresa,
        numeroDocumento: prestador.numeroDocumento,
        foto: prestador.foto,
        servicoPrestado: prestador.servicoPrestado
    }
    try {
        if (token !== null) {
            const id = prestador.id;
            console.log("PRESTADOR : ", id);
            const response = await axios.put(`${url}/update/prestador/${id}`, entregadorData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.data
            console.log("DATA : ", data);
            return data
        } else {
            return {}
        }
    } catch (error) {
        console.log(error);
    }
})

const initialState = {
    prestadores: [],
    status: 'idle',
    error: null
}
export const apiPrestadorSlice = createSlice({
    name: "prestador",
    initialState,
    reducers: {
        addPrestador: {
            reducer: (state, action) => {
                console.log("PAYLOAD");
                state.entregadores.push("entregador4")
            },
            //prepare : () => {}
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPrestadores.pending, (state, action) => {
                state.status = 'loading'
                action.payload = []
            })
            .addCase(fetchPrestadores.fulfilled, (state, action) => {
                if (action.payload === undefined) {
                    return state.prestadores = []
                }
                const loadedPrestadores = action.payload.map(prestador => {
                    prestador.criadoEm = moment(prestador.criadoEm).format('YYYY-mm-dd');
                    return prestador;
                })

                state.prestadores = loadedPrestadores;
            })
            .addCase(fetchPrestadores.rejected, () => {
                console.log("rejected");
            })
            .addCase(deletePrestador.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(deletePrestador.fulfilled, (state, action) => {
                if (action.payload === "") {
                    console.log("Nenhum Prestador deletado")
                    return;
                }
                const id = action.payload;
                const prestadoresRestantes = state.prestadores.filter(prestador => prestador.id !== id)
                state.prestadores = prestadoresRestantes;

            })
            .addCase(deletePrestador.rejected, () => {
                console.log("rejected");
            })
            .addCase(postPrestador.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(postPrestador.fulfilled, (state, action) => {
                const newPrestador = {
                    id: action.payload.id,
                    nome: action.payload.nome,
                    numeroDocumento: action.payload.numeroDocumento,
                    empresa: action.payload.empresa,
                    foto: action.payload.foto,
                    criadoEm: action.payload.criadoEm
                }
                state.prestadores.push(newPrestador);

            })
            .addCase(postPrestador.rejected, () => {
                console.log("rejected");
            })
            .addCase(updatePrestador.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(updatePrestador.rejected, () => {
                console.log("rejected");
            })
            .addCase(updatePrestador.fulfilled, (state, action) => {
                console.log("fulfilled : ", action.payload);
                if (action.payload.id === "") {
                    console.log("NADA ACONTECEU");
                    return;
                }
                const prestadores = state.prestadores.filter(prestador => prestador.id !== action.payload.id)
                state.prestadores = [...prestadores, action.payload];
            })
    }
})
export const getPrestadores = (state) => state.prestador.prestadores
export const getPrestadorPeloId = (state, id) => state.prestador.prestadores.find(prestador => prestador.id === id)
export const getStatus = (state) => state.prestador.status
export const { addPrestador } = apiPrestadorSlice.actions
export default apiPrestadorSlice.reducer;