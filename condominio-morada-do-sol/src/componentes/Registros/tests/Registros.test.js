import "@testing-library/jest-dom"
import { screen, render, queries } from "@testing-library/react"
import React from "react"
import Registros from '../Registros'
import { Provider, useDispatch } from "react-redux"
import { apiSliceServicosPrestados, useLazyGetServicosPrestadosQuery } from "../../../features/api/servicos/apiServicosPrestados"
import { MemoryRouter, Route, Routes } from "react-router"
import user from "@testing-library/user-event"
import * as apiServicos from "../../../features/api/servicos/apiServicosPrestados";
import PerfilRegistro from "../PerfilRegistro"
const mockServicos = [{
    id: "1",
    morador: {
        id: "2",
        nome: "Osvaldo",
        apartamento: "1201",
        bloco: "C"
    },
    prestador: {
        nome: "Heleno",
        id: 3,
    },
    observacaoSobreServico: "Nenhuma observação",
    dataInicioDoServico: "2025-04-16T14:44:47.817",
    dataEncerramentoDoServico: "2025-04-16T14:45:02.364",
    tipoDeServico: "tipo de servico",
}]
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
}))
jest.mock("../../../features/api/servicos/apiServicosPrestados", () => ({
    useRegistrarEncerramentoDoServicoMutation: jest.fn(() => ([jest.fn()])),
    useGetServicosPrestadosQuery: jest.fn(() => (
        [jest.fn(),
            { data: mockServicos, isLoading: false }]
    )),
    useLazyGetServicosPrestadosQuery: jest.fn(() => (
        [jest.fn(),
        { data: mockServicos, isLoading: false }])),
    apiSliceServicosPrestados: {
        reducerPath: "apiSliceServicosPrestados",
        reducer: {
            queries: {},
            subscriptions: {},
            providers: {},
            mutations: {}
        }
    }
}))

const getState = jest.fn()
const subscribe = jest.fn()
const store = {
    getState,
    subscribe,
    dispatch: jest.fn()
}


const renderComponent = () => {
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<Registros />}/>
                    <Route path="detalhes-do-registro/:idRegistro" element={<PerfilRegistro />}/>
                </Routes>                
            </MemoryRouter>
        </Provider>
    )
}

describe('Registros', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        apiServicos.useLazyGetServicosPrestadosQuery.mockReturnValue([jest.fn(), { data: mockServicos, isLoading: false }]);
        useDispatch.mockReturnValue(mockDispatch)
    })
    user.setup()

    test('should render correctly', async () => {
        renderComponent();

        expect(screen.getByLabelText(/modo de busca/i)).toBeInTheDocument()
        expect(screen.getByText(/data/i)).toBeInTheDocument()
        expect(screen.getByText(/Apartamento e bloco/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/data do serviço/i)).toBeInTheDocument()
        //não devem estar visiveis
        expect(await screen.queryByPlaceholderText(/apartamento/i)).not.toBeInTheDocument()
        expect(screen.queryByPlaceholderText(/bloco/i)).not.toBeInTheDocument()
        //legenda
        expect(screen.getByText(/morador/i)).toBeInTheDocument()
        expect(screen.getByText(/apartamento$/i)).toBeInTheDocument()
        expect(screen.getByText(/^bloco$/i)).toBeInTheDocument()
        expect(screen.getByText(/prestador/i)).toBeInTheDocument()
        expect(screen.getByText(/entrada/i)).toBeInTheDocument()
        expect(screen.getByText(/saída/i)).toBeInTheDocument()
        //morador id: "2",
        //nome: "Osvaldo",
        //apartamento: "1201",
        //bloco: "C"
        expect(screen.getByText(/osvaldo/i)).toBeInTheDocument()
        expect(screen.getByText(/1201/i)).toBeInTheDocument()
        expect(screen.getByText(/^c$/i)).toBeInTheDocument()
        expect(screen.getByText(/heleno/i)).toBeInTheDocument()


    })

    test('should change modo busca', async () => {

        renderComponent();

        const selectElem = screen.getByLabelText(/modo de busca/i);
        await user.selectOptions(selectElem, "bloco-apartamento");
        expect(selectElem.value).toBe("bloco-apartamento")
        expect(screen.queryByPlaceholderText(/apartamento/i)).toBeInTheDocument()
        expect(screen.queryByPlaceholderText(/bloco/i)).toBeInTheDocument()
    })

    test('should show carregando if isLoading is true', () => {
        apiServicos.useLazyGetServicosPrestadosQuery.mockReturnValue([jest.fn(),
        { data: mockServicos, isLoading: true }])

        renderComponent()


        expect(screen.getByText(/carregando.../i)).toBeInTheDocument()
    })
    test('should show "sem registros if não tiver registros" ', () => {
        apiServicos.useLazyGetServicosPrestadosQuery.mockReturnValue([jest.fn(),
            { data: [], isLoading: false }])
    
            renderComponent()

            expect(screen.getByText(/sem registros/i)).toBeInTheDocument()
    })
    test('should go to perfil do registro', async() => { 


        renderComponent();

        const linkToPerfil = screen.getByTestId(/linkToPerfilRegistro/i);
        const linkToPerfilAsMorador = screen.getByText(/osvaldo/i);
        expect(linkToPerfil).toBeInTheDocument()
        expect(linkToPerfil.href.includes("/detalhes-do-registro/1")).toBe(true)
        await user.click(linkToPerfilAsMorador)
        expect(screen.getByText(/Carregando registro.../i)).toBeInTheDocument()

     })
})

