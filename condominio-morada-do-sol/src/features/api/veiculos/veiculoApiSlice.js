import { createApi } from '@reduxjs/toolkit/query/react';
import { getFetchBaseQuery } from '../autenticacao/baseQuery';
const url = process.env.REACT_APP_APP_BASE_URL_SERVICO_VEICULO


console.log(url);


export const veiculoApiSlice = createApi({
    reducerPath: 'apiVeiculos',
    baseQuery: getFetchBaseQuery(url),
    tagTypes: ["veiculos"],
    endpoints: (builder) => ({
        getVeiculos: builder.query({
            query: () => ({
                url: "/api/todosveiculos",
                method: "GET",
            }),
            providesTags: ["veiculos"]
        }),
        getVeiculoPeloId: builder.query({
            query: ({ token, id }) => ({
                url: `/api/veiculo/${id}`,
                method: 'GET',
            }),
            providesTags: ['veiculos']
        }),
        getVeiculoPelaPlaca: builder.query({
            query: ({placa }) => ({
                url: `/api/veiculo?placa=${placa}`,
                method: 'GET',
            }),
            providesTags: ['veiculos']
        }),
        getProprietarioPeloIdVeiculo: builder.query({
            query: ({ id }) => ({
                url: `/api/moradores/proprietario/${id}`,
                method: 'GET',
            }),
            providesTags: ['veiculos']
        }),
        enviarVeiculo: builder.mutation({
            query: ({ veiculo }) => ({
                url: "/api/salvarveiculo",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-Content-Type-Options': 'nosniff'
                },
                body: JSON.stringify({
                    placa: veiculo.placa,
                    modelo: veiculo.modelo,
                    marca: veiculo.marca,
                    cor: veiculo.cor,
                    foto: "",
                    vaga: veiculo.vaga,
                    tipoDeAutorizacao: veiculo.tipoDeAutorizacao,
                    statusDeAcesso: veiculo.status_de_acesso,
                    observacao: veiculo.observacao,
                    nomeProprietario: veiculo.nomeProprietario,
                    bloco: veiculo.bloco,
                    apartamento: veiculo.apartamento,
                    documentoProprietario: veiculo.documentoProprietario,
                }),
                
            }),
            transformResponse: (response) =>{
                console.log(response);
                return response;
            },
            invalidatesTags: ["veiculos"]
        })
    })
})

export const {
    useGetVeiculosQuery,
    useLazyGetVeiculoPeloIdQuery,
    useLazyGetVeiculoPelaPlacaQuery,
    useGetVeiculoPeloIdQuery,
    useEnviarVeiculoMutation
} = veiculoApiSlice