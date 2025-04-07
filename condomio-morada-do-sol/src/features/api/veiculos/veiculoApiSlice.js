import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const url = process.env.REACT_APP_APP_BASE_URL_SERVICO_VEICULO



export const veiculoApiSlice = createApi({
    reducerPath: 'apiVeiculos',
    baseQuery: fetchBaseQuery({ baseUrl: url }),
    tagTypes: ["veiculos"],
    endpoints: (builder) => ({
        getVeiculos: builder.query({
            query: () => ({
                url: "/api/todosveiculos",
                method: "GET",
                headers: {
                    "content-type": "text/plain",
                },
            }),
            providesTags: ["veiculos"]
        }),
        getVeiculoPeloId: builder.query({
            query: ({ token, id }) => ({
                url: `/api/veiculo/${id}`,
                headers: {
                    "content-type": "text/plain"
                },
                method: 'GET',
            }),
            providesTags: ['veiculos']
        }),
        getVeiculoPelaPlaca: builder.query({
            query: ({placa }) => ({
                url: `/api/veiculo?placa=${placa}`,
                headers: {
                    "content-type": "application/json"
                },
                method: 'GET',
            }),
            providesTags: ['veiculos']
        }),
        getProprietarioPeloIdVeiculo: builder.query({
            query: ({ token, id }) => ({
                url: `/api/moradores/proprietario/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json"
                },
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