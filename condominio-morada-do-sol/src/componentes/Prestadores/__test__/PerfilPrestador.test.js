import React from "react";
import "@testing-library/jest-dom"
import { screen, render, queries } from "@testing-library/react"
import PerfilPrestador from "../PerfilPrestador";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { apiPrestadorSlice } from "../../../features/api/prestadores/apiPrestadorSlice";
import { apiSliceServicosPrestados, useGetServicosPrestadosQuery } from "../../../features/api/servicos/apiServicosPrestados";
import { MemoryRouter, useNavigate } from "react-router";
import user from "@testing-library/user-event"


jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn()
}))
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}))
jest.mock('../../../features/api/prestadores/apiPrestadorSlice', () => ({
    getPrestadores: jest.fn(() => ({ data: [] })),
    getPrestadorPeloId: jest.fn(() => ({})),
    updatePrestador: jest.fn(() => ({ data: [] })),
    deletePrestador: jest.fn(() => ({})),
    apiPrestadorSlice: {
        reducerPath: 'apiPrestadorSlice',
        reducer: {
            queries: {},
            providers: {},
            subscriptions: {},
            mutations: {}
        }
    }
}))
jest.mock('../../../features/api/servicos/apiServicosPrestados', () => ({
    useGetServicosPrestadosQuery: jest.fn(() => ({
        data: [
            {
                idPrestadorDeServico: '1',
                idMorador: '2',
                tipoDeServico: "entregaServico.tipoDeServico",
                observacaoSobreServico: "entregaServico.observacaoSobreServico"
            }
        ]
    })),
    apiSliceServicosPrestados: {
        reducerPath: 'apiSliceServicosPrestados',
        reducer: {
            queries: {},
            providers: {},
            subscriptions: {},
            mutations: {}
        }
    }
}))



describe('Perfil prestador', () => {
    user.setup()
    const mockDispatch = jest.fn()
    const mockUseNavigate = jest.fn()
    
    const store = configureStore({
        reducer: {
            [apiPrestadorSlice.reducerPath]: () => apiPrestadorSlice.reducer,
            [apiSliceServicosPrestados.reducerPath]: () => apiSliceServicosPrestados.reducer
        }
    })

    const modeloPrestador = {
        nome: "Bonifacio", 
        sobrenome: "Rezende", 
        empresa: "BR servicos", 
        numeroDocumento: "123.456.789-89", 
        foto: "", 
        idVeiculo: "",
        servicoPrestado: "drenagem de dutos"
      };
    beforeEach(() => {
        jest.clearAllMocks()
        useSelector.mockImplementation((selectorFn) => selectorFn({}))
        useDispatch.mockReturnValue(mockDispatch)
        useNavigate.mockReturnValue(mockUseNavigate)

        const servicoApi = require('../../../features/api/servicos/apiServicosPrestados')
        const prestadorApi = require('../../../features/api/prestadores/apiPrestadorSlice')
        servicoApi.useGetServicosPrestadosQuery.mockReturnValue([{
            idPrestadorDeServico: '1',
            idMorador: '2',
            tipoDeServico: "entregaServico.tipoDeServico",
            observacaoSobreServico: "entregaServico.observacaoSobreServico"
        }])

        prestadorApi.getPrestadorPeloId.mockReturnValue(modeloPrestador)
        prestadorApi.deletePrestador.mockReturnValue({})

    })

    test('should render correctly', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <PerfilPrestador />
                </MemoryRouter>
            </Provider>
        )

        const headingEmpresa = screen.getByRole('heading', { name: /empresa/i })
        const headingDocumento = screen.getByRole('heading', { name: /documento/i })
        const headingTipoDeServico = screen.getByRole('heading', { name: /tipo de serviço/i })
        const btnDeletar = screen.getByRole('button', { name: /Deletar/i })
        const linkAtualizar = screen.getByRole('link', { name: /atualizar/i })
        const linkRegistrarEntrada = screen.getByRole('link', { name: /registrar entrada/i })
        expect(headingEmpresa).toBeInTheDocument();
        expect(headingEmpresa.textContent.split(":")[1].trim()).toBe("BR servicos");
        expect(headingDocumento).toBeInTheDocument();
        expect(headingTipoDeServico).toBeInTheDocument();
        expect(btnDeletar).toBeInTheDocument();
        expect(linkAtualizar).toBeInTheDocument();
        expect(linkRegistrarEntrada).toBeInTheDocument();
        
    })

    test('should show carregando if there is not a prestador', () => { 
        const prestadorApi = require('../../../features/api/prestadores/apiPrestadorSlice')
        prestadorApi.getPrestadorPeloId.mockReturnValue(null)
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <PerfilPrestador />
                </MemoryRouter>
            </Provider>
        )

        const loading = screen.getByTestId('loading')
        expect(loading).toBeInTheDocument();
    })

    test('should delete prestador', async() => { 
        const prestadorApi = require('../../../features/api/prestadores/apiPrestadorSlice')
        prestadorApi.deletePrestador.mockReturnValue({})
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <PerfilPrestador />
                </MemoryRouter>
            </Provider>
        )

        const btnDeletar = screen.getByRole('button', {name: /deletar/i})
        const headingNome = screen.getByRole('heading', {name: /bonifacio rezende/i})

        expect(btnDeletar).toBeInTheDocument();
        expect(headingNome).toBeInTheDocument();

        await user.click(btnDeletar)

        expect(mockDispatch).toHaveBeenCalled();
        expect(prestadorApi.deletePrestador).toHaveBeenCalled();

     })
})