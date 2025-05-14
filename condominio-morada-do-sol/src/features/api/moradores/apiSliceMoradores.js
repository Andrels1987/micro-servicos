import { createApi } from '@reduxjs/toolkit/query/react';
import { getFetchBaseQuery } from '../autenticacao/baseQuery';
const url = process.env.REACT_APP_APP_BASE_URL_SERVICO_MORADOR;


export const apiSliceMoradores = createApi({
    reducerPath: 'apiMoradores',
    baseQuery: getFetchBaseQuery(url),
    tagTypes: ["moradores"],
    endpoints: (builder) => ({
        getMoradores: builder.query({
            query: () => ({
                url: '/moradores',
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        addMorador: builder.mutation({
            query: ({morador}) => ({
                url: "/morador/add",
                method: 'POST',
                body: {
                    nome: morador.nome,
                    sobrenome: morador.sobrenome,
                    apartamento: morador.apartamento,
                    bloco: morador.bloco,
                    foto: morador.foto,
                    telefone: morador.telefone,
                    documento: morador.documento
                }
            }),
            invalidatesTags: ['moradores']
        }),
        removerMorador: builder.mutation({
            query: (id) =>({
                url: `/morador/delete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["moradores"]
        }),
        updateMorador: builder.mutation({
            query: (morador) => ({
                url: `/update/morador/${morador.id}`,
                method: 'PUT',
                body: {
                    id: morador.id,
                    nome: morador.nome,
                    sobrenome: morador.sobrenome,
                    documento: morador.documento,
                    apartamento: morador.apartamento,
                    bloco: morador.bloco,
                    veiculos: morador.veiculos,
                    foto: morador.foto,
                    telefone: morador.telefone,
                    dependentes: morador.dependentes,
                    ativo: morador.ativo
                }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'moradores', id: arg.id }]
         
        }),
        getMoradorPeloId: builder.query({
            query: (id) => ({
                url: `/moradores/perfil/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, arg) => [{ type: 'moradores', id: arg.id }],
        }),
        getMoradorPeloDocumento: builder.query({
            query: ({documento}) => ({
                url: `/morador/documento/${documento}`,
                method: 'GET',
            }),
            providesTags: (result, error, {documento}) => [{ type: 'moradores', documento: documento }],
        }),
        associarDependenteAoMorador: builder.mutation({
            query: ({idMorador, dependente}) => ({
                url: `/adicionardependente/morador/${idMorador}`,
                body:{
                    parentesco: dependente.parentesco,
                    _id: dependente.id
                },
                method: 'PUT',
            }),
            invalidatesTags: ['moradores']
        }),
        addEntrega: builder.mutation({
            //precisa ser o mesmo nome de quando é chamado
            //se foi passado morador, o parametro tem ser morador.
            query: ({ entregaServico }) => ({
                // query : (entrega) => ({
                url: "/add/servico",
                method: 'POST',
                body: {
                    nomeEntregador: entregaServico.nomeEntregador,
                    empresaEntregador: entregaServico.empresaEntregador,
                    numeroDocumentoEntregador: entregaServico.numeroDocumentoEntregador,
                    idEntregador: entregaServico.idEntregador,
                    nomeMorador: entregaServico.nomeMorador, 
                    bloco: entregaServico.bloco,
                    apartamento: entregaServico.apartamento,
                    tipoDeServico: entregaServico.tipoDeServico,
                    observacao: entregaServico.observacao
                }
            }),
            invalidatesTags: ['moradores']
        }),
        getEntregas: builder.query({
            query: () => ({
                url:`/servicosprestados`,
                method: 'GET',
                }),
            providesTags: ['moradores']
        }),
        getVeiculos: builder.query({
            query: () => ({
                url: `/veiculos`,
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        getVeiculoPeloId: builder.query({
            query: ({ id}) => ({
                url: `/veiculo/${id}`,
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        getProprietarioPeloIdVeiculo: builder.query({
            query: ({ id}) => ({
                url: `/moradores/proprietario/${id}`,
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        getProprietarioPelaPlacaVeiculo: builder.query({
            query: ({placa}) => ({
                url: `/morador/veiculo/placa/${placa}`,
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        logoutApp: builder.mutation({
            query: () => ({
                url: `/auth/logout`,
                method: 'POST',
            }),
            invalidatesTags: ['moradores']
        }),
    })
})

export const {
    useGetMoradoresQuery,
    useGetMoradorPeloIdQuery,
    useAddMoradorMutation,
    useUpdateMoradorMutation,
    useLazyGetMoradorPeloDocumentoQuery,
    useAddEntregaMutation,
    useGetEntregasQuery,
    useGetVeiculosQuery,
    useGetVeiculoPeloIdQuery,
    useGetProprietarioPeloIdVeiculoQuery,
    useGetProprietarioPelaPlacaVeiculoQuery,
    useLogoutAppMutation, 
    useAssociarDependenteAoMoradorMutation,
    useRemoverMoradorMutation
} = apiSliceMoradores