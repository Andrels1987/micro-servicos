import React, { useState as useStateMock } from 'react';
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react';
import PerfilVeiculo from '../PerfilVeiculo';
import { MemoryRouter, useParams } from 'react-router';
import * as veiculoApiSlice from "../../../features/api/veiculos/veiculoApiSlice";
import { useGetVeiculoPeloIdQuery, useLazyGetVeiculoPeloIdQuery } from '../../../features/api/veiculos/veiculoApiSlice';
import { useGetTokenQuery } from '../../../features/api/moradores/apiSliceMoradores';


// Mockando o useParams
jest.mock("react-router", () => ({
    ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));


jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

jest.mock("../../../features/api/moradores/apiSliceMoradores", () => ({
    useGetProprietarioPelaPlacaVeiculoQuery: jest.fn(() => ({ data: {} })),
    useGetTokenQuery: jest.fn(() => ({token: ""})),
    reducer: () => ({
        queries: {},
        mutations: {},
        provided: {},
        subscriptions: {},
    }),
    reducerPath: "apiMoradores"
}))
jest.mock("../../../features/api/veiculos/veiculoApiSlice", () => ({
    useLazyGetVeiculoPeloIdQuery: jest.fn(),
    useGetVeiculoPeloIdQuery: jest.fn(() => ({ data: {} })),
    veiculoApiSlice: {
        reducer: () => ({
            queries: {},
            mutations: {},
            provided: {},
            subscriptions: {},

        }),
        reducerPath: "veiculoApiSlice"
    }
}))


describe('PerfilVeiculo', () => {

    
    const veiculo = {
        id: 1,
        marca: "Honda",
        modelo: "Civic",
        cor: "Verde",
        placa: "HTL1f87",
        foto: null,
        isLoading: false,
        isError: false

    }

    const proprietario = {
        id: 1,
        nome: "Andre",
        sobrenome: "Silva",
        apartamento: "1801",
        bloco: "C"
    }
    const setPlaca = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ id: veiculo.id });
        require("../../../features/api/veiculos/veiculoApiSlice")
            .useGetVeiculoPeloIdQuery.mockReturnValue({ data: veiculo })
        require("../../../features/api/moradores/apiSliceMoradores")
            .useGetProprietarioPelaPlacaVeiculoQuery.mockReturnValue({ data: proprietario })

        useStateMock.mockImplementation(init => [init, setPlaca])
       

    })


    test('deve renderizar loading se veiculo for null', () => {
        require("../../../features/api/veiculos/veiculoApiSlice")
            .useGetVeiculoPeloIdQuery.mockReturnValue({ data: null });

        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )

        const loadingElement = screen.getByText("Loading...");
        expect(loadingElement).toBeInTheDocument();


    })

    test('deve renderizar corretamente o componente com veiculo', () => {

        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )

        const marca = screen.getByText(veiculo.marca);
        const modelo = screen.getByText(veiculo.modelo);
        const cor = screen.getByText(veiculo.cor);
        const placa = screen.getByText(veiculo.placa);
        const foto = screen.getByAltText("foto-veiculo");
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
        const nome = screen.
            getByLabelText("proprietario");
        expect(nome).toBeInTheDocument();
        expect(nome.textContent).toBe("Andre Silva | 1801 C");


    })
    test('deve renderizar loading o  proprietario', () => {
        require("../../../features/api/moradores/apiSliceMoradores")
            .useGetProprietarioPelaPlacaVeiculoQuery.mockReturnValue({ data: null })
        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )

        const loading = screen.getByText("Loading...");
        expect(loading).toBeInTheDocument();
        expect(loading.textContent).toBe("Loading...");


    })
    test('Exibe uma imagem padrão caso veiculo.foto seja null ou undefined', () => {
        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )

        const foto = screen.getByAltText("foto-veiculo");
        expect(foto.getAttribute('src')).toBe("../../logo192.png");


    })
    test('chamar useState com a placa ', async () => {

        render(
            <MemoryRouter>
                <PerfilVeiculo />
            </MemoryRouter>
        )
        
        await waitFor(() => {
            expect(setPlaca).toHaveBeenCalledWith("HTL1f87");
        })



    })
    test('chamar useGetVeiculoPeloIdQuery com os parametros corretos ', async () => {

        render(
            <MemoryRouter>
                <PerfilVeiculo token={"meutoken"}/>
            </MemoryRouter>
        )
        jest.spyOn(veiculoApiSlice, "useGetVeiculoPeloIdQuery").mockReturnValue({ data: veiculo });
        await waitFor(() => {
            expect(veiculoApiSlice.useGetVeiculoPeloIdQuery).toHaveBeenCalledTimes(1);
            expect(veiculoApiSlice.useGetVeiculoPeloIdQuery).toHaveBeenCalledWith({id: 1, token: "meutoken"} );
        })




    })
    

})