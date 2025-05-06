import React from "react";
import "@testing-library/jest-dom"
import { screen, render, queries } from "@testing-library/react"
import PerfilPrestador from "../PerfilPrestador";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import reducer, { apiPrestadorSlice } from "../../../features/api/prestadores/apiPrestadorSlice";
import { apiSliceServicosPrestados, useGetServicosPrestadosQuery } from "../../../features/api/servicos/apiServicosPrestados";
import { MemoryRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import user from "@testing-library/user-event"
import * as servicoApi from '../../../features/api/servicos/apiServicosPrestados'
import * as prestadorApi from '../../../features/api/prestadores/apiPrestadorSlice'
import FormPrestador from "../FormPrestador";
import RegistrarEntrada from "../../Registros/RegistrarEntrada"
import { apiSliceMoradores, useGetMoradoresQuery } from "../../../features/api/moradores/apiSliceMoradores";
import PrestadorPage from '../PrestadorPage';
import PrestadorList from "../PrestadorList";
import Registros from '../../Registros/Registros'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
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
    fetchPrestadores: jest.fn(() => ({ type: 'prestadores/fetchPrestadores' })),
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
    useAddServicoPrestadoMutation: jest.fn(() => ([])),
    useGetServicosPrestadosQuery: jest.fn(() => (
        {
            data: [
                {
                    idPrestadorDeServico: '1',
                    idMorador: '2',
                    tipoDeServico: "entregaServico.tipoDeServico",
                    observacaoSobreServico: "entregaServico.observacaoSobreServico"
                }
            ], isLoading: false, IsSuccess: undefined, isError: false
        }
    )),
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

jest.mock("../../../features/api/moradores/apiSliceMoradores", () => ({
    useGetMoradoresQuery: jest.fn(() => ({ data: [] })),
    apiSliceMoradores: {
        reducerPath: 'apiSliceMoradores',
        reducer: {
            queries: {},
            mutations: {},
            subscriptions: {},
            providers: {}
        }
    }
}))
const store = configureStore({
    reducer: {
        [apiPrestadorSlice.reducerPath]: apiPrestadorSlice.reducer,
        [apiSliceServicosPrestados.reducerPath]: apiSliceServicosPrestados.reducer
    }
})

const renderComponent = () => (
    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={["/"]}>
                <Routes> 
                    
                        <Route path="/" element={<PerfilPrestador />} />
                        <Route path={"update-prestador/:idPrestador"} element={<FormPrestador />} />
                        <Route path="registros">
                            <Route path={"registrar-entrada/:idPrestador"} element={<RegistrarEntrada />} /> 
                        </Route>                    
                </Routes>
            </MemoryRouter>
        </Provider>
    )
)

describe('Perfil prestador', () => {
    user.setup()
    const mockDispatch = jest.fn()
    const mockUseNavigate = jest.fn()



    const modeloPrestador = {
        id: "1",
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
        useParams.mockReturnValue({ idPrestador: '1' })
        useSelector.mockImplementation((selectorFn) => selectorFn({}))
        useDispatch.mockReturnValue(mockDispatch)
        useNavigate.mockReturnValue(mockUseNavigate)

        servicoApi.useGetServicosPrestadosQuery.mockReturnValue([{
            idPrestadorDeServico: '1',
            idMorador: '2',
            tipoDeServico: "entregaServico.tipoDeServico",
            observacaoSobreServico: "entregaServico.observacaoSobreServico"
        }])

        prestadorApi.getPrestadorPeloId.mockReturnValue(modeloPrestador)

    })

    test('should render correctly', () => {
        renderComponent();

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
        prestadorApi.getPrestadorPeloId.mockReturnValue(null)
        renderComponent();

        const loading = screen.getByTestId('loading')
        expect(loading).toBeInTheDocument();
    })

    test('should delete prestador', async () => {
        prestadorApi.deletePrestador.mockReturnValue({})
        renderComponent()

        const btnDeletar = screen.getByRole('button', { name: /deletar/i })
        const headingNome = screen.getByRole('heading', { name: /bonifacio rezende/i })

        expect(btnDeletar).toBeInTheDocument();
        expect(headingNome).toBeInTheDocument();

        await user.click(btnDeletar)

        expect(mockDispatch).toHaveBeenCalled();
        expect(prestadorApi.deletePrestador).toHaveBeenCalled();
        expect(mockUseNavigate).toHaveBeenCalledWith('/prestadores')
    })

    test('should go to update prestador', async () => {
        renderComponent();

        const linkUpdate = screen.getByText(/atualizar/i)
        expect(linkUpdate).toBeInTheDocument()

        await user.click(linkUpdate);

        const inputNome = screen.getByPlaceholderText('nome')
        const inputSobrenome = screen.getByPlaceholderText(/sobrenome/i)
        expect(inputNome).toBeInTheDocument();
        expect(inputSobrenome).toBeInTheDocument();
    })
    test('should go to registrar entrada', async () => {
        renderComponent();

        const linkRegistrarEntrada = screen.getByText(/registrar entrada/i)
        expect(linkRegistrarEntrada).toBeInTheDocument()

        await user.click(linkRegistrarEntrada);

        const prestadorNome = screen.getByRole('heading',{level: 6, name: /bonifacio/i})
        const headingBuscarMorador = screen.getByRole('heading', {name: /Buscar Morador/i })
        const menuItemNome = screen.getByText("Nome");
        const headingDadosPS = screen.getByRole('heading', {name: /Dados da Prestação de Serviço/i})
        const menuItemAptBloco = screen.getByText(/Apartamento:.*/i)
        const btnConfirmar = screen.getByRole('button', {name: /confirmar entrada/i})

        expect(btnConfirmar).toBeInTheDocument();
        expect(headingBuscarMorador).toBeInTheDocument();
        expect(menuItemAptBloco).toBeInTheDocument();
        expect(menuItemNome).toBeInTheDocument();
        expect(prestadorNome).toBeInTheDocument();
        expect(headingDadosPS).toBeInTheDocument();
    })
})