import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const url = process.env.REACT_APP_BASE_URL_AUTENTICACAO;


export const apiSliceAutenticacao = createApi({
    reducerPath: "apiAutenticacao",
    baseQuery: fetchBaseQuery({baseUrl: url}),
    tagTypes: ['autenticacao'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({login}) =>({
                url: '/auth/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': ['http://localhost:3000'],
                    'Access-Control-Allow-Credentials': 'true',
                    'Host': ['http://localhost:3000'],
                },
                body: {
                    username: login.username,
                    password: login.password,
                    role: login.role
                }
            }),
            invalidatesTags: ['autenticacao']
        }),
        register: builder.mutation({
            query: ({user}) => ({
                url: "/auth/register",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: {
                    username: user.username,
                    password: user.password,
                    role: user.role
                }
            }),
            invalidatesTags: ['autenticacao']
        })
    })
})

export const {
    useLoginMutation,
    useRegisterMutation
} = apiSliceAutenticacao