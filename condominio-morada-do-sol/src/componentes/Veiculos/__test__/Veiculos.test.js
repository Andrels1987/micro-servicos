import React, { useRef } from "react";
import { MemoryRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";

import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import user from '@testing-library/user-event'
import Veiculos from "../Veiculos";
import PerfilVeiculo from "../PerfilVeiculo";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { veiculoApiSlice } from "../../../features/api/veiculos/veiculoApiSlice";
import * as veiculoApi from "../../../features/api/veiculos/veiculoApiSlice"

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
}))

const mockNavigate = jest.fn()
const mockVeiculos = [
    {
        _id: "1",
        marca: "Honda",
        modelo: "Civic",
        cor: "Verde",
        placa: "HTL1f87",
        foto: null,
        motorista: {
            id: 1,
            nome: "Andre",
            sobrenome: "Silva",
            apartamento: "1801",
            bloco: "C"
        }
    }
]
/*  const mockRef = {
    current: {
        scrollTo: null
    }
} 
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn(() => mockRef)
})) */
    


jest.mock("../../../features/api/veiculos/veiculoApiSlice", () => ({
    useGetVeiculosQuery: jest.fn(() => ({ data: mockVeiculos, isLoading: false, isError: false, error: false })),
    useGetVeiculoPeloIdQuery: jest.fn(() => ({ data: mockVeiculos[0], isLoading: false, isError: false })),
    veiculoApiSlice: {
        reducerPath: "veiculoSlice",
        reducer: {
            queries: {},
            mutations: {},
            provided: {},
            subscriptions: {},
        }
    }
}))

const store = configureStore({
        reducer: {
            [veiculoApiSlice.reducerPath]: () => veiculoApiSlice.reducer
        }
    })
const renderComponente = () => (
     render(
        <Provider store={store}>
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<Veiculos />} />
                    <Route path="/perfil-veiculo/:id" element={<PerfilVeiculo />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    )
)

describe("Veiculos", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        HTMLElement.prototype.scrollTo = jest.fn();
        useParams.mockReturnValue({id: "1"})
        useNavigate.mockReturnValue(mockNavigate)
        veiculoApi.useGetVeiculosQuery.mockReturnValue({ data: mockVeiculos, isLoading: false, isError: false, error: false })

    })
    test('deve renderizar corretamente', () => {
        renderComponente();

        expect(screen.getByPlaceholderText(/Digite a placa do veículo/i)).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 3, name: /honda civic/i }))
        expect(screen.getByRole('link', { name: /Honda Civic Cor: Verde Placa: HTL1f87/i }))
    })
    test('deve mostrar Carregando... se isLoading for true', () => {
        veiculoApi.useGetVeiculosQuery.mockReturnValue({ data: mockVeiculos, isLoading: true, isError: false, error: false })
        renderComponente();

        expect(screen.getByTestId(/loading/i)).toBeInTheDocument()

    })
    test('deve mostrar Fetch Error. Redirecionando em... se isError for true', () => {
        veiculoApi.useGetVeiculosQuery.mockReturnValue(
            {
                data: mockVeiculos,
                isLoading: false,
                isError: true,
                error: {
                    status: "Fetch Error"
                }
            })
        renderComponente();

       expect(screen.getByText(/^fetch error.*/i)).toBeInTheDocument()

    })
    test('deve mostrar Erro desconhecido. Redirecionando em... se isError for true', () => {
        veiculoApi.useGetVeiculosQuery.mockReturnValue(
            {
                data: mockVeiculos,
                isLoading: false,
                isError: true,
                error: {
                    status: null
                }
            })
        renderComponente();

        expect(screen.getByText(/^Erro desconhecido.*/i)).toBeInTheDocument()

    })
    test('deve mostrar Nenhum veicuo encontrado se veiculos for null', () => {
        veiculoApi.useGetVeiculosQuery.mockReturnValue(
            {
                data: null,
                isLoading: false,
                isError: false,
                error: null
            })
        renderComponente();

        expect(screen.getByText(/Nenhum veículo encontrado./i)).toBeInTheDocument()

    })
    test('deve ir para perfil do veicullo', async () => {

        renderComponente();
        const link = screen.getByRole('link', { name: /Honda Civic Cor: Verde Placa: HTL1f87/i })
        expect(link).toBeInTheDocument()
        await user.click(link)
        await screen.findByTestId('proprietario')
        expect(veiculoApi.useGetVeiculoPeloIdQuery).toHaveBeenCalled()
        expect(veiculoApi.useGetVeiculoPeloIdQuery).toHaveBeenCalledWith({ id: mockVeiculos[0]._id })


    }) 
})