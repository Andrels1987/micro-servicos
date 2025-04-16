import {configureStore} from '@reduxjs/toolkit'
import prestadorReducer from '../features/api/prestadores/apiPrestadorSlice'
import { apiSliceMoradores } from '../features/api/moradores/apiSliceMoradores'
import  contadorReducer  from '../features/api/user/apiUserSlice'
import { veiculoApiSlice } from '../features/api/veiculos/veiculoApiSlice'
import { apiSliceServicosPrestados } from '../features/api/servicos/apiServicosPrestados'
import { apiSliceAutenticacao } from '../features/api/autenticacao/apiSliceAuth'

//erros.
    //color reducerPath ao inves de reducer linha 10
export const store = configureStore({
    reducer :{
        user : contadorReducer,
        prestador : prestadorReducer,
        [apiSliceMoradores.reducerPath] : apiSliceMoradores.reducer,
        [veiculoApiSlice.reducerPath] : veiculoApiSlice.reducer,
        [apiSliceServicosPrestados.reducerPath] : apiSliceServicosPrestados.reducer,
        [apiSliceAutenticacao.reducerPath]: apiSliceAutenticacao.reducer
    },
    //obrigado colocar este declaração
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSliceMoradores.middleware, 
            veiculoApiSlice.middleware, 
            apiSliceServicosPrestados.middleware, apiSliceAutenticacao.middleware)
    
})