import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const url = process.env.REACT_APP_APP_BASE_URL_SERVICO_SERVICOPRESTADO;

export const apiSliceServicosPrestados = createApi({
    reducerPath: 'apiServicosPrestados',
    baseQuery: fetchBaseQuery({ baseUrl: url }),
    tagTypes: ['servicos'],
    endpoints: (builder) => ({
        getServicosPrestados: builder.query({
            query: ({token}) => ({
                url: 'servicosprestados',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "text/plain"
                },
            }),
            providesTags: ['servicos']
        }),
        addServicoPrestado: builder.mutation({
            //precisa ser o mesmo nome de quando é chamado
            //se foi passado morador, o parametro tem ser morador.
            query: ({ entregaServico, token }) => ({
                // query : (entrega) => ({
                url: "/servicosprestados/add",
                headers:{
                    Authorization: `Bearer ${token}`,
                    //erro-resolvido: passei de 'text/plain' para 'application/json'
                    "content-type": "application/json"
                },
                method: 'POST',
                body: {
                    idPrestadorDeServico: entregaServico.idPrestadorDeServico,
                    idMorador: entregaServico.idMorador, 
                    tipoDeServico: entregaServico.tipoDeServico,
                    observacaoSobreServico: entregaServico.observacaoSobreServico
                }
            }),
            invalidatesTags: ['servicos']
        }),
        registrarEncerramentoDoServico: builder.mutation({
            query : ({registro}) =>({
                url : `update/registro/encerramento/${registro.id}`,
                headers: {
                    "content-type": "application/json"
                },
                method: 'PUT',                
            }),
            invalidatesTags : ['servicos']
        })
        
    })
})

export const {
    useGetServicosPrestadosQuery,
    useAddServicoPrestadoMutation,
    useRegistrarEncerramentoDoServicoMutation
} = apiSliceServicosPrestados