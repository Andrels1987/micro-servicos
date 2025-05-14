import React from "react";
import PerfilMorador from "../PerfilMorador";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import '@testing-library/jest-dom';
import user from "@testing-library/user-event"
import FormMoradores from "../FormMoradores";
import MoradoresList from '../MoradoresList'
import { apiSliceMoradores, useGetMoradoresQuery, useRemoverMoradorMutation } from "../../../features/api/moradores/apiSliceMoradores";


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
}))
const mockRemoverMorador = jest.fn(() => ({ unwrap: mockUnwrap }));
const mockUnwrap = jest.fn().mockResolvedValue({});
const mockAddMorador = jest.fn(() => ({ unwrap: mockUnwrap }));
const mockUpdateMorador = jest.fn(() => ({ unwrap: mockUnwrap }));
const mockAssociarDependente = jest.fn(() => ({ unwrap: mockUnwrap }));
const mockGetMoradorPeloDocumento = jest.fn(() => ({ unwrap: mockUnwrap }));
const morador = {
    id: 1,
    nome: "Andre Luis",
    sobrenome: "Silva",
    apartamento: "1002",
    bloco: "C",
    telefone: "21 9090909090",
    documento: "123456789",
    veiculos: [],
    dependentes: [],
    foto: "",
    criadoEm: "",
}

const mockRefetch = jest.fn();
jest.mock("../../../features/api/moradores/apiSliceMoradores", () => ({
    useGetMoradorPeloIdQuery: jest.fn(() => ({ data: morador, isLoading: false, error: false, refetch: mockRefetch })),
    useUpdateMoradorMutation: jest.fn(() => ([mockUpdateMorador])),
    useLazyGetMoradorPeloDocumentoQuery: jest.fn(() => [mockGetMoradorPeloDocumento]),
    useAssociarDependenteAoMoradorMutation: jest.fn(() => [mockAssociarDependente]),
    useRemoverMoradorMutation: jest.fn(() => ([mockRemoverMorador])),
    useAddMoradorMutation: jest.fn(() => ([mockAddMorador])),
    useGetMoradoresQuery: jest.fn(() => (
        {
            data: [],
            isLoading: false,
            isSuccess: true,
            isError: false,
            error: false
        })),
    apiSliceMoradores: {
        reducerPath: "apiMoradores",
        reducer: {
            queries: {},
            mutations: {},
            provided: {},
            subscriptions: {},
        }, // Agora retorna um estado válido    
    },
}));
const store = configureStore({
    reducer: {
        [apiSliceMoradores.reducerPath]: () => apiSliceMoradores.reducer,
    },

});

const renderComponent = () => {
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<PerfilMorador />} />
                    <Route path="update-morador/:id" element={<FormMoradores />} />
                    <Route path="moradores" element={<MoradoresList />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    )
}

describe("PerfilMorador", () => {


    beforeEach(() => {

        jest.clearAllMocks();
        user.setup();
        useNavigate.mockReturnValue(mockNavigate)
        useParams.mockReturnValue({ id: morador.id })
        require("../../../features/api/moradores/apiSliceMoradores")
            .useUpdateMoradorMutation.mockReturnValue([mockUpdateMorador]);
        require("../../../features/api/moradores/apiSliceMoradores")
            .useLazyGetMoradorPeloDocumentoQuery.mockReturnValue([mockGetMoradorPeloDocumento]);

        require("../../../features/api/moradores/apiSliceMoradores")
            .useAssociarDependenteAoMoradorMutation.mockReturnValue([mockAssociarDependente]);

        require("../../../features/api/moradores/apiSliceMoradores")
            .useGetMoradorPeloIdQuery.mockReturnValue({ data: morador, refetch: jest.fn() });

        require("../../../features/api/moradores/apiSliceMoradores")
            .useAddMoradorMutation.mockReturnValue([mockAddMorador]);

        require("../../../features/api/moradores/apiSliceMoradores")
            .useRemoverMoradorMutation.mockReturnValue([mockRemoverMorador]);
    });





    test("should render correctly", () => {
        renderComponent()

        const h4NomeElement = screen.getAllByRole("heading", { level: 4 });
        const nomeElement = h4NomeElement.find(el => el.textContent.includes("Nome"))
        expect(nomeElement.textContent).toContain("Nome");
    });

    test("should show carregando se morador não existir", () => {
        require("../../../features/api/moradores/apiSliceMoradores").useGetMoradorPeloIdQuery.mockReturnValue({
            data: null,  // Dados inexistentes
            isLoading: true,  // Ainda está carregando
            isError: false,
            refetch: jest.fn()
        });
        renderComponent();

        const loadingEle = screen.getByTestId("loading");

        expect(loadingEle).toBeInTheDocument();
    });

    test("should show 'nenhum veiculo'", () => {

        renderComponent();

        const pElement = screen.getByText("nenhum veiculo");

        expect(pElement).toBeInTheDocument();
    });
    test("should show 'sem dependente'", () => {

        renderComponent();

        const pElement = screen.getByText("sem dependentes");

        expect(pElement).toBeInTheDocument();
    });

    test("should go to update-morador page", async () => {

        renderComponent()


        const updateLinkElement = screen.getByRole('link', { name: 'Atualizar' });



        expect(updateLinkElement).toBeInTheDocument();

        await user.click(updateLinkElement)

        const campoNome = screen.getByPlaceholderText(/^nome/i);

        await waitFor(() => {
            expect(campoNome).toBeInTheDocument();
        })

    });
    test("should call mockRemoverMorador and mockUseNavigate", async () => {

        renderComponent()


        const deleteMoradorElement = screen.getByRole('button', { name: 'Remover' });



        expect(deleteMoradorElement).toBeInTheDocument();

        await user.click(deleteMoradorElement)
        screen.debug();

        expect(mockRemoverMorador).toHaveBeenCalled();
        expect(mockRemoverMorador).toHaveBeenCalledWith(morador.id);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/moradores");
        });
        
    });
    
});
