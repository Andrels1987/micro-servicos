import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const url = process.env.REACT_APP_APP_BASE_URL_SERVICO_MORADOR;


export const apiSliceMoradores = createApi({
    reducerPath: 'apiMoradores',
    baseQuery: fetchBaseQuery({ baseUrl: url }),
    tagTypes: ["moradores"],
    endpoints: (builder) => ({
        getMoradores: builder.query({
            query: ({token}) => ({
                url: '/moradores',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "text/plain"
                },
            }),
            providesTags: ['moradores']
        }),
        addMorador: builder.mutation({
            query: ({morador, token}) => ({
                url: "/morador/add",
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    nome: morador.nome,
                    sobrenome: morador.sobrenome,
                    apartamento: morador.apartamento,
                    bloco: morador.bloco,
                    foto: morador.foto,
                    telefone: morador.telefone,
                    documento: morador.documento
                }

                    /* "nome": "Ferdnand",
                    "sobrenome": "Rodrigues",
                    "apartamento": "2022",
                    "bloco": "C",    
                    "listaVeiculos": [],
                    "foto": "",
                    "telefone": "212221212222",
                    "listaDependentes": [] */
            }),
            invalidatesTags: ['moradores']
        }),
        updateMorador: builder.mutation({
            query: ({morador}) => ({
                url: `/update/morador/${morador.id}`,
                method: 'PUT',
                headers: {
                    "content-type": "application/json"
                },
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
                    dependentes: morador.dependentes
                }
            }),
            invalidatesTags: ['moradores']           
        }),
        getMoradorPeloId: builder.query({
            query: ({token, id}) => ({
                url: `/moradores/perfil/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "text/plain"
                },
                method: 'GET',
            }),
            invalidatesTags: ['moradores']
        }),
        getMoradorPeloDocumento: builder.query({
            query: ({token, documento}) => ({
                url: `/morador/documento/${documento}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "text/plain"
                },
                method: 'GET',
            }),
            invalidatesTags: ['moradores']
        }),
        associarDependenteAoMorador: builder.mutation({
            query: ({idMorador, dependente}) => ({
                url: `/adicionardependente/morador/${idMorador}`,
                headers: {
                    "content-type": "application/json"
                },
                body:{
                    parentesco: dependente.parentesco,
                    _id: dependente.id
                },
                method: 'PUT',
            }),
            invalidatesTags: ['moradores']
        }),
        getLogin: builder.mutation({
            query: ({email, password}) => ({
                url: "/auth/login",
                method: 'POST',  
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': ['http://localhost:3000'],
                    'Access-Control-Allow-Credentials': 'true',
                    'Host': ['http://localhost:3000'],
                },                          
                body: {
                    loginEmail: email,
                    password: password
                }
            }),
            invalidatesTags: ['moradores']
        }),
        addEntrega: builder.mutation({
            //precisa ser o mesmo nome de quando é chamado
            //se foi passado morador, o parametro tem ser morador.
            query: ({ entregaServico, token }) => ({
                // query : (entrega) => ({
                url: "/add/servico",
                headers:{
                    Authorization: `Bearer ${token}`,
                    //erro-resolvido: passei de 'text/plain' para 'application/json'
                    "content-type": "application/json"
                },
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
            query: ({token}) => ({
                url:`/servicosprestados`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "text/plain"
                }}),
            providesTags: ['moradores']
        }),
        getVeiculos: builder.query({
            query: ({token}) => ({
                url: `/veiculos`,
                headers : {
                    Authorization: `Bearer ${token}`,
                    "content-type": "text/plain"
                },
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        getVeiculoPeloId: builder.query({
            query: ({token, id}) => ({
                url: `/veiculo/${id}`,
                headers : {
                    Authorization: `Bearer ${token}`,
                    "content-type": "text/plain"
                },
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        getToken: builder.query({
            query: () => ({
                url: `/auth/token`,
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        getProprietarioPeloIdVeiculo: builder.query({
            query: ({token, id}) => ({
                url: `/moradores/proprietario/${id}`,
                headers : {
                    Authorization: `Bearer ${token}`,
                    "content-type": "text/plain"
                },
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        getProprietarioPelaPlacaVeiculo: builder.query({
            query: ({token, placa}) => ({
                url: `/morador/veiculo/placa/${placa}`,
                headers : {
                    Authorization: `Bearer ${token}`,
                    "content-type": "text/plain"
                },
                method: 'GET',
            }),
            providesTags: ['moradores']
        }),
        logoutApp: builder.mutation({
            query: () => ({
                url: `/auth/logout`,
                method: 'POST',
            }),
            providesTags: ['moradores']
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
    useGetLoginMutation,
    useGetVeiculoPeloIdQuery,
    useGetProprietarioPeloIdVeiculoQuery,
    useGetProprietarioPelaPlacaVeiculoQuery,
    useLogoutAppMutation, 
    useGetTokenQuery,
    useAssociarDependenteAoMoradorMutation
} = apiSliceMoradores