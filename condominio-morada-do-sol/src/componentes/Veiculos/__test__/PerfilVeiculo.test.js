import React, { useState as useStateMock } from 'react';
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react';
import PerfilVeiculo from '../PerfilVeiculo';
import { useGetVeiculoPeloIdQuery, veiculoApiSlice } from '../../../features/api/veiculos/veiculoApiSlice';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as veiculoApi from "../../../features/api/veiculos/veiculoApiSlice";
import { useParams, MemoryRouter } from 'react-router-dom';




const mockVeiculo = {
    id: "1",
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
// Mockando o useParams
jest.mock("react-router-dom", () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));




jest.mock("../../../features/api/veiculos/veiculoApiSlice", () => ({
    useGetVeiculoPeloIdQuery: jest.fn(() => ({ data: mockVeiculo, isLoading: false, isError: false })),
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


describe('PerfilVeiculo', () => {

    const store = configureStore({
        reducer: {
            [veiculoApiSlice.reducerPath]: () => veiculoApiSlice.reducer
        }
    })

    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ id: mockVeiculo.id });
        require("../../../features/api/veiculos/veiculoApiSlice")
            .useGetVeiculoPeloIdQuery.mockReturnValue({ data: mockVeiculo, isLoading: false, isError: false })

    })

    test('deve renderizar loading se veiculo for null', () => {
        require("../../../features/api/veiculos/veiculoApiSlice")
            .useGetVeiculoPeloIdQuery.mockReturnValue({ data: null, isLoading: true, isError: false })
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <PerfilVeiculo />
                </MemoryRouter>
            </Provider>
        )

        const loadingElement = screen.getByText("Carregando veículo...");
        expect(loadingElement).toBeInTheDocument();


    })

    test('deve renderizar corretamente o componente com veiculo', () => {

        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )

        const marca = screen.getByText(mockVeiculo.marca);
        const modelo = screen.getByText(mockVeiculo.modelo);
        const cor = screen.getByText(mockVeiculo.cor);
        const placa = screen.getByText(mockVeiculo.placa);
        const foto = screen.getByAltText(`Foto do veículo ${mockVeiculo.placa}`);
        expect(marca).toBeInTheDocument();
        expect(modelo).toBeInTheDocument();
        expect(cor).toBeInTheDocument();
        expect(placa).toBeInTheDocument();
        expect(foto).toBeInTheDocument();


    })

    test('deve renderizar corretamente o componente com proprietario', () => {

        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )

        //Andre Silva | 1801 C
        const nome = screen.getByTestId("proprietario");
        expect(nome).toBeInTheDocument();
        expect(nome.textContent).toBe("Andre Apto: 1801 - Bloco C");


    })
    test('deve renderizar loading se proprietario não existir', () => {
        require("../../../features/api/veiculos/veiculoApiSlice")
            .useGetVeiculoPeloIdQuery.mockReturnValue({ data: { ...mockVeiculo, motorista: null } })
        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )

        const loading = screen.getByText("Carregando proprietário...");
        expect(loading).toBeInTheDocument();
        expect(loading.textContent).toBe("Carregando proprietário...");


    })
    test('Exibe uma imagem padrão caso veiculo.foto seja null ou undefined', () => {
        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )

        const foto = screen.getByAltText(`Foto do veículo ${mockVeiculo.placa}`);
        expect(foto.getAttribute('src')).toBe("/logo192.png");


    })

    test('chamar useGetVeiculoPeloIdQuery com os parametros corretos ', async () => {



        const spy = jest.spyOn(veiculoApi, "useGetVeiculoPeloIdQuery")
            .mockReturnValue({ data: mockVeiculo, isLoading: false, isError: false });
        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({ id: mockVeiculo.id });
        })




    })


})