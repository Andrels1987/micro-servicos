import { createApi } from '@reduxjs/toolkit/query/react';
import { getFetchBaseQuery } from './baseQuery';

const url = process.env.REACT_APP_BASE_URL_AUTENTICACAO;

console.log(url);

export const apiSliceAutenticacao = createApi({
    reducerPath: "apiAutenticacao",
    baseQuery: getFetchBaseQuery(url),
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
        }),
        sendEmail: builder.mutation({
            query: (email) => ({
                url: '/auth/forgot-password',
                method: "POST",
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: {
                    email
                }
            }),
            invalidatesTags: ['autenticacao']
        }),
        redefinirSenha: builder.mutation({
            query: ({token, newPassword}) =>({
                url: "/auth/reset-password",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: {
                    token,
                    newPassword
                }
            })
        })
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useSendEmailMutation,
    useRedefinirSenhaMutation
} = apiSliceAutenticacao