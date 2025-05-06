import React from "react";
import PerfilMorador from "../PerfilMorador";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import '@testing-library/jest-dom';
import user from "@testing-library/user-event"
import FormMoradores from "../FormMoradores";
import { apiSliceMoradores } from "../../../features/api/moradores/apiSliceMoradores";

jest.mock("../../../features/api/moradores/apiSliceMoradores", () => ({
    useGetMoradorPeloIdQuery: jest.fn(),
    useUpdateMoradorMutation: jest.fn(),
    useLazyGetMoradorPeloDocumentoQuery: jest.fn(),
    useAssociarDependenteAoMoradorMutation: jest.fn(),
    useAddMoradorMutation: jest.fn(),
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
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<PerfilMorador />} />
                        <Route path="update-morador/:id" element={<FormMoradores />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
    )
}

describe("PerfilMorador", () => {

    const data = {
        data: {
            id: 1,
            nome: "Andre Luis",
            sobrenome: "Silva",
            apartamento: "1002",
            bloco: "C",
            telefone: "21 9090909090",
            veiculos: [],
            dependentes: []
        },
        isLoading: false,
        isError: false,
    }
    beforeEach(() => {
        jest.clearAllMocks();
        user.setup();
        require("../../../features/api/moradores/apiSliceMoradores")
            .useUpdateMoradorMutation.mockReturnValue([data]);
        require("../../../features/api/moradores/apiSliceMoradores")
            .useLazyGetMoradorPeloDocumentoQuery.mockReturnValue([data]);
        require("../../../features/api/moradores/apiSliceMoradores")
            .useAssociarDependenteAoMoradorMutation.mockReturnValue([data]);
        require("../../../features/api/moradores/apiSliceMoradores")
            .useGetMoradorPeloIdQuery.mockReturnValue(data);
        require("../../../features/api/moradores/apiSliceMoradores")
            .useAddMoradorMutation.mockReturnValue([data]);
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


        const updateLinkElement = screen.getByRole('link', { name: 'atualizar' });



        expect(updateLinkElement).toBeInTheDocument();

        await user.click(updateLinkElement)

        const campoNome = screen.getByPlaceholderText(/^nome/i);

        await waitFor(() => {
            expect(campoNome).toBeInTheDocument();
        })

    });
});
