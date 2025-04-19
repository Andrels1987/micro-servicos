import { createApi } from '@reduxjs/toolkit/query/react';
import { getFetchBaseQuery } from '../autenticacao/baseQuery';

const url = process.env.REACT_APP_APP_BASE_URL_SERVICO_SERVICOPRESTADO;

export const apiSliceServicosPrestados = createApi({
    reducerPath: 'apiServicosPrestados',
    //baseQuery: fetchBaseQuery({ baseUrl: url }),
    baseQuery: getFetchBaseQuery(url),
    tagTypes: ['servicos'],
    endpoints: (builder) => ({
        getServicosPrestados: builder.query({
            query: () => ({
                url: 'servicosprestados',
                method: 'GET',
            }),
            providesTags: ['servicos']
        }),
        addServicoPrestado: builder.mutation({
            //precisa ser o mesmo nome de quando é chamado
            //se foi passado entregaServico, o parametro tem ser entregaServico.
            query: ({ entregaServico }) => ({
                url: "/servicosprestados/add",
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
            query : ({registro }) =>({
                url : `update/registro/encerramento/${registro.id}`,
                method: 'PUT',                
            }),
            invalidatesTags : ['servicos']
        })
        
    })
})

export const {
    useGetServicosPrestadosQuery,
    useLazyGetServicosPrestadosQuery,
    useAddServicoPrestadoMutation,
    useRegistrarEncerramentoDoServicoMutation
} = apiSliceServicosPrestados