
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Login from "../Login";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { apiSliceAutenticacao } from "../../../features/api/autenticacao/apiSliceAuth";
import { MemoryRouter } from "react-router-dom";
import user from "@testing-library/user-event"
import PrestadorList from '../../Prestadores/PrestadorList'
import { apiPrestadorSlice } from "../../../features/api/prestadores/apiPrestadorSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const mockLogin = jest.fn();
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}))
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}))

jest.mock("../../../features/api/autenticacao/apiSliceAuth", () => ({
    useLoginMutation: jest.fn(),
    useRegisterMutation: jest.fn(),
    apiSliceAutenticacao: {
        reducerPath: "apiAutenticacao",
        reducer: {
            queries: {},
            mutations: {},
            provided: {},
            subscriptions: {}
        }
    }
}))
jest.mock("../../../features/api/prestadores/apiPrestadorSlice", () => ({
    getPrestadores: jest.fn(() => ({ data: [] })),
    getPrestadorPeloId: jest.fn(() => ({})),
    fetchPrestadores: jest.fn(() => ({ data: [] })),
    apiPrestadorSlice: {
        reducer: {
            queries: {},
            mutations: {},
            provided: {},
            subscriptions: {},
        },
        reducerPath: "apiPrestador"
    }
}));
describe("Login", () => {
    mockDispatch = jest.fn()
    const dataPrestadores = {
        data: [
            { foto: "", id: 1, nome: 'Andre Luis', empresa: "Cristal", numeroDocumento: "1234567890" },
            { foto: "", id: 2, nome: 'Maria José', empresa: "Rio Farma", numeroDocumento: "1234567891" }
        ],
        isLoading: false,
        isError: false,
    }

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate)
        useSelector.mockReturnValue([])//useSelector retorna objeto ou array de objetos
        useDispatch.mockReturnValue(mockDispatch)//useDispatch retorna uma função
        require("../../../features/api/prestadores/apiPrestadorSlice")
            .getPrestadores.mockReturnValue([dataPrestadores.data])
        require("../../../features/api/autenticacao/apiSliceAuth")
            .useLoginMutation.mockReturnValue([
                mockLogin.mockResolvedValue({ data: { token: "fake-token" } })
            ]);
    });
    const store = configureStore({
        reducer: {
            [apiPrestadorSlice.reducerPath]: () => apiPrestadorSlice.reducer,
            [apiSliceAutenticacao.reducerPath]: () => apiSliceAutenticacao.reducer
        },

    })

     test('should  render correctly', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>
        )

        const inputUsername = screen.getByPlaceholderText("enter username");
        const imputPassword = screen.getByPlaceholderText("enter password");
        const buttonLogin = screen.getByTestId("button-login");
        const textLogin = screen.getAllByText(/login/i);

        expect(inputUsername).toBeInTheDocument();
        expect(imputPassword).toBeInTheDocument();
        expect(buttonLogin).toBeInTheDocument();
        expect(textLogin).toHaveLength(2)

    }) 

    test('shoud go to prestadores', async () => {

        user.setup();
        render(
            <Provider store={store} >
                <MemoryRouter>
                    <Login />
                    <PrestadorList />
                </MemoryRouter>
            </Provider>
        )

        const buttonElement = screen.getByRole('button', { name: /login/i })
        const inputUsername = screen.getByPlaceholderText("enter username");
        const imputPassword = screen.getByPlaceholderText("enter password");


        expect(buttonElement).toBeInTheDocument();


        await user.type(inputUsername, "andre");
        await user.type(imputPassword, "als1987");
        await user.click(buttonElement);

        expect(sessionStorage.getItem("jwt")).toBe('fake-token')
        const labelElem = screen.getByLabelText(/modo de busca/i);
        expect(mockDispatch).toHaveBeenCalled();
        expect(labelElem).toBeInTheDocument();

    })



})