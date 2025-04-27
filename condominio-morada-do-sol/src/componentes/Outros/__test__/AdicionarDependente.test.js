
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdicionarDependente from '../AdicionarDependente'
import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { apiSliceMoradores } from '../../../features/api/moradores/apiSliceMoradores'
import { MemoryRouter } from 'react-router'
import user from "@testing-library/user-event"

jest.mock("../../../features/api/moradores/apiSliceMoradores", () => ({
    useLazyGetMoradorPeloDocumentoQuery: jest.fn(),
    useAssociarDependenteAoMoradorMutation: jest.fn(),
    useGetMoradorPeloIdQuery: jest.fn(),
    apiSliceMoradores: {
        reducerPath: 'apiSliceMoradores',
        reducer: {
            queries: {},
            mutations: {},
            providers: {},
            subscriptions: {}
        }
    }
}))

describe("Adicionar Dependente", () => {
    const morador = {
        apartamento: "1702",
        bloco: "A",
        criadoEm: null,
        dependentes:[],
        documento: "125.234.566-43",
        foto: "",
        id: "678d88620ed5f86a07c8e18e",
        modificadoEm: null,
        nome: "Ricardo",
        sobrenome: "Malfredo Junior",
        telefone: "21966873608",
    }
    const getMoradorPeloDocumentoMock = jest.fn(() => Promise.resolve({
        data: {
            id: 1,
            nome: "João",
            sobrenome: "Silva",
            documento: "125.214.567-43",
            foto: ""
        }
    }));
    const associarDependenteMock = jest.fn(() => Promise.resolve({
        data: {}
    }));
    beforeEach(() => {
        jest.clearAllMocks();
        const api = require("../../../features/api/moradores/apiSliceMoradores");

        api.useLazyGetMoradorPeloDocumentoQuery.mockReturnValue([
            getMoradorPeloDocumentoMock
        ]);

        api.useAssociarDependenteAoMoradorMutation.mockReturnValue([
            associarDependenteMock
        ]);
    })
    const store = configureStore({
        reducer: {
            [apiSliceMoradores.reducerPath]: () => apiSliceMoradores.reducer
        }
    })

    test('should render correctly', async () => {
        refetchMock = jest.fn()
        user.setup();

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdicionarDependente morador={morador} refetch={refetchMock}/>
                </MemoryRouter>
            </Provider>
        )

        const addDependentButton = screen.getByText("+");
        expect(addDependentButton).toBeInTheDocument()
        await user.click(addDependentButton);
        const associarButton = screen.getByRole("button", { name: 'Associar dependente ao morador' });
        const buscarButton = screen.getByRole("button", { name: 'buscar' });
        const documentInput = screen.getByPlaceholderText("documento");
        const nomeInput = screen.getByPlaceholderText("nome");
        const sobrenomeInput = screen.getByPlaceholderText("sobrenome");
        const parentescoInput = screen.getByPlaceholderText("parentesco");

        expect(documentInput).toBeInTheDocument()
        expect(nomeInput).toBeInTheDocument()
        expect(sobrenomeInput).toBeInTheDocument()
        expect(parentescoInput).toBeInTheDocument()
        expect(buscarButton).toBeInTheDocument()
        expect(associarButton).toBeInTheDocument()

        expect(associarButton.disabled).toBe(true)
        await user.type(documentInput, "125.214.567-43")
        await user.click(buscarButton);
        expect(documentInput.value).toBe("125.214.567-43")

        expect(nomeInput.value).toBe("João");

        expect(associarButton.disabled).toBe(false)
        await user.click(associarButton);

        expect(associarDependenteMock).toHaveBeenCalled()
        expect(associarDependenteMock).toHaveBeenCalledTimes(1)

    })
})