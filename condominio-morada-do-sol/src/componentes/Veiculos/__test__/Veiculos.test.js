import React, { useRef } from "react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router";

import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import user from '@testing-library/user-event'
import Veiculos from "../Veiculos";
import * as apiVeiculos from "../../../features/api/veiculos/veiculoApiSlice"
import PerfilVeiculo from "../PerfilVeiculo";

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
const mockRef = {
    current: {
        scrollTo: null
    }
}
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn(() => ({mockRef}))
}))
jest.mock("react-router", () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn()
}))
jest.mock("../../../features/api/veiculos/veiculoApiSlice", () => ({
    useGetVeiculosQuery: jest.fn(() => ({ data: mockVeiculos, isLoading: false, isError: false, error: false })),
    useGetVeiculoPeloIdQuery: jest.fn(() => ({data: {}, isLoading: false, isError: false}))
}))

const renderComponente = () => {
    return render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route index element={<Veiculos />}/>
                <Route path="perfil-veiculo/:id" element={<PerfilVeiculo />}/>
            </Routes>            
        </MemoryRouter>
    )
}

describe("Veiculos", () => {
    beforeEach(() =>{
        jest.clearAllMocks()
        apiVeiculos.useGetVeiculosQuery.mockReturnValue({ data: mockVeiculos, isLoading: false, isError: false, error: false })
        
    })
    test('deve renderizar corretamente', () => {
        renderComponente();

        expect(screen.getByPlaceholderText(/Digite a placa do veículo/i)).toBeInTheDocument()
        expect(screen.getByRole('heading', {level: 3, name: /honda civic/i}))
        expect(screen.getByRole('link', {name: /Honda Civic Cor: Verde Placa: HTL1f87/i}))
    })
    test('deve mostrar Carregando... se isLoading for true', () => {
        apiVeiculos.useGetVeiculosQuery.mockReturnValue({ data: mockVeiculos, isLoading: true, isError: false, error: false })
        renderComponente();

        expect(screen.getByTestId(/loading/i)).toBeInTheDocument()
        
    })
    test('deve mostrar Fetch Error. Redirecionando em... se isError for true', () => {
        apiVeiculos.useGetVeiculosQuery.mockReturnValue(
            { data: mockVeiculos, 
                isLoading: false, 
                isError: true, 
                error: {
                    status: "Fetch Error"
                } })
        renderComponente();

        expect(screen.getByText(/^fetch error.*/i)).toBeInTheDocument()
        
    })
    test('deve mostrar Erro desconhecido. Redirecionando em... se isError for true', () => {
        apiVeiculos.useGetVeiculosQuery.mockReturnValue(
            { data: mockVeiculos, 
                isLoading: false, 
                isError: true, 
                error: {
                    status: null
                } })
        renderComponente();

        expect(screen.getByText(/^Erro desconhecido.*/i)).toBeInTheDocument()
        
    })
    test('deve mostrar Nenhum veicuo encontrado se veiculos for null', () => {
        apiVeiculos.useGetVeiculosQuery.mockReturnValue(
            { data: null, 
                isLoading: false, 
                isError: false, 
                error: null 
            })
        renderComponente();

        expect(screen.getByText(/Nenhum veículo encontrado./i)).toBeInTheDocument()
        
    })
     test('deve ir para perfil do veicullo', async() => {
       
        renderComponente();
        const link = screen.getByRole('link', {name: /Honda Civic Cor: Verde Placa: HTL1f87/i})
        expect(link).toBeInTheDocument()
        await user.click(link)
        expect(apiVeiculos.useGetVeiculoPeloIdQuery).toHaveBeenCalled()
        expect(apiVeiculos.useGetVeiculoPeloIdQuery).toHaveBeenCalledWith({id: mockVeiculos[0]._id})

        
    })
})