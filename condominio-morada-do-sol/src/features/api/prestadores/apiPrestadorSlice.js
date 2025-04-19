import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

const url = process.env.REACT_APP_APP_BASE_URL_SERVICO_PRESTADOR;

export const fetchPrestadores = createAsyncThunk(
  "prestadores/fetchPrestadores",
  async (_, { rejectWithValue }) => {
    
    const token = sessionStorage.getItem('jwt');

    try { 
      const response = await axios.get(`${url}/prestadores`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao buscar prestadores.");
    }
  }
);

export const fetchPrestadorPeloId = createAsyncThunk(
  "prestadores/fetchPrestadorPeloId",
  async ({ id }, { rejectWithValue }) => {
    const token = sessionStorage.getItem('jwt');
    console.log(token);
    try {
      const response = await axios.get(`${url}/prestador/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao buscar prestador.");
    }
  }
);

export const deletePrestador = createAsyncThunk(
  "prestadores/deletePrestadores",
  async ({ id }, { rejectWithValue }) => {
    const token = sessionStorage.getItem('jwt');
    try {
      await axios.delete(`${url}/delete/prestador/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao deletar prestador.");
    }
  }
);

export const postPrestador = createAsyncThunk(
  "prestadores/postPrestadores",
  async ({ prestador }, { rejectWithValue }) => {
    const token = sessionStorage.getItem('jwt');
    try {
      const criadoEm = new Date();
      const response = await axios.post(
        `${url}/add/prestador`,
        { ...prestador, criadoEm },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao cadastrar prestador.");
    }
  }
);

export const updatePrestador = createAsyncThunk(
  "prestadores/updatePrestador",
  async ({ newPrestador }, { rejectWithValue }) => {

    const token = sessionStorage.getItem('jwt');
    try {
      const id = newPrestador.id;
      const prestadorData = {
        id,
        nome: newPrestador.nome,
        sobrenome: newPrestador.sobrenome,
        empresa: newPrestador.empresa,
        numeroDocumento: newPrestador.numeroDocumento,
        foto: newPrestador.foto,
        servicoPrestado: newPrestador.servicoPrestado,
      };

      const response = await axios.put(
        `${url}/update/prestador/${id}`,
        prestadorData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao atualizar prestador.");
    }
  }
);

const initialState = {
  prestadores: [],
  status: "idle",
  error: null,
};

export const apiPrestadorSlice = createSlice({
  name: "prestador",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPrestadores.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPrestadores.fulfilled, (state, action) => {
        const loaded = action.payload.map((p) => ({
          ...p,
          criadoEm: moment(p.criadoEm).format("YYYY-MM-DD"),
        }));
        state.prestadores = loaded;
        state.status = "succeeded";
      })
      .addCase(fetchPrestadores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH PELO ID
      .addCase(fetchPrestadorPeloId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPrestadorPeloId.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchPrestadorPeloId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // DELETE
      .addCase(deletePrestador.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePrestador.fulfilled, (state, action) => {
        state.prestadores = state.prestadores.filter((p) => p.id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(deletePrestador.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // POST
      .addCase(postPrestador.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postPrestador.fulfilled, (state, action) => {
        const novoPrestador = {
          ...action.payload,
          criadoEm: moment(action.payload.criadoEm).format("YYYY-MM-DD"),
        };
        state.prestadores.push(novoPrestador);
        state.status = "succeeded";
      })
      .addCase(postPrestador.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updatePrestador.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePrestador.fulfilled, (state, action) => {
        state.prestadores = state.prestadores.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
        state.status = "succeeded";
      })
      .addCase(updatePrestador.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const getPrestadores = (state) => state.prestador.prestadores;
export const getPrestadorPeloId = (state, id) =>
  state.prestador.prestadores.find((p) => p.id === id);
export const getStatus = (state) => state.prestador.status;
export const getError = (state) => state.prestador.error;

export default apiPrestadorSlice.reducer;
