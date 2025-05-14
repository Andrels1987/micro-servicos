import "@testing-library/jest-dom"
import { render, screen, } from "@testing-library/react"
import user from "@testing-library/user-event"
import React from "react"
import RedefinirSenha from "../RedefinirSenha"
import { Provider } from "react-redux"
import { MemoryRouter, useLocation } from "react-router-dom"
import { useRedefinirSenhaMutation } from "../../../features/api/autenticacao/apiSliceAuth"

const mockResetPassword = jest.fn(jest.fn(() => ({ data: { message: null } })))
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn(() => ({ search: "query-string" }))
}))

jest.mock("../../../features/api/autenticacao/apiSliceAuth", () => ({
    useRedefinirSenhaMutation: jest.fn(() => ([mockResetPassword]))
}))

describe("REDEFINIR SENHA", () => {

    const store = {
        getState: jest.fn(),
        subscribe: jest.fn()
    }

    test('should render correctly', () => {

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <RedefinirSenha />
                </MemoryRouter>
            </Provider>
        )

        expect(screen.getByText("Redefinir Senha")).toBeInTheDocument()
        expect(screen.getByText("Nova senha:")).toBeInTheDocument()
        expect(screen.getByTestId("senha")).toBeInTheDocument()
        expect(screen.getByText("Confirmar nova senha:")).toBeInTheDocument()
        expect(screen.getByTestId("novasenha")).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /redefinir/i })).toBeInTheDocument()

    })

    test('should change input value', async () => {

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <RedefinirSenha />
                </MemoryRouter>
            </Provider>
        )
        const inputSenha = screen.getByTestId("senha")
        const inputNovaSenha = screen.getByTestId("novasenha")
        expect(screen.getByText("Redefinir Senha")).toBeInTheDocument()
        expect(screen.getByText("Nova senha:")).toBeInTheDocument()
        expect(inputSenha).toBeInTheDocument()
        expect(screen.getByText("Confirmar nova senha:")).toBeInTheDocument()
        expect(inputNovaSenha).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /redefinir/i })).toBeInTheDocument()

        await user.type(inputSenha, "novasenha")
        await user.type(inputNovaSenha, "novasenha")

        expect(inputSenha.value).toBe('novasenha')
        expect(inputNovaSenha.value).toBe('novasenha')
    })
    test('should show "As senhas não conferem"', async () => {

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <RedefinirSenha />
                </MemoryRouter>
            </Provider>
        )
        const inputSenha = screen.getByTestId("senha")
        const inputNovaSenha = screen.getByTestId("novasenha")
        const buttonRedefinir = screen.getByRole('button', { name: /redefinir/i })
        expect(inputSenha).toBeInTheDocument()
        expect(inputNovaSenha).toBeInTheDocument()


        await user.type(inputSenha, "novasenha1")
        await user.type(inputNovaSenha, "novasenha")
        await user.click(buttonRedefinir)

        expect(screen.getByText("As senhas não coincidem")).toBeInTheDocument();

    })
    test('should show "Senha redefinida com sucesso!"', async () => {
        const mockUnwrap = jest.fn(() => new Promise((res) => res({ data : {message : null }})))
        
        useRedefinirSenhaMutation.mockReturnValue([jest.fn(() => ({
            unwrap: mockUnwrap
        }))])
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <RedefinirSenha />
                </MemoryRouter>
            </Provider>
        )
        const inputSenha = screen.getByTestId("senha")
        const inputNovaSenha = screen.getByTestId("novasenha")
        const buttonRedefinir = screen.getByRole('button', { name: /redefinir/i })
        expect(inputSenha).toBeInTheDocument()
        expect(inputNovaSenha).toBeInTheDocument()


        await user.type(inputSenha, "novasenha")
        await user.type(inputNovaSenha, "novasenha")
        await user.click(buttonRedefinir)

        expect(screen.getByText("Senha redefinida com sucesso!")).toBeInTheDocument();

    })
    test('should show "Erro ao redefinir senha"', async () => {
        const mockUnwrap = jest.fn(() => new Promise((_, reject) => reject({ status: "FETCH_ERROR" })))
        const mockResetPassword = jest.fn(() => ({
            unwrap: mockUnwrap
        }))
        useRedefinirSenhaMutation.mockReturnValue([mockResetPassword])
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <RedefinirSenha />
                </MemoryRouter>
            </Provider>
        )
        const inputSenha = screen.getByTestId("senha")
        const inputNovaSenha = screen.getByTestId("novasenha")
        const buttonRedefinir = screen.getByRole('button', { name: /redefinir/i })
        expect(inputSenha).toBeInTheDocument()
        expect(inputNovaSenha).toBeInTheDocument()


        await user.type(inputSenha, "novasenha")
        await user.type(inputNovaSenha, "novasenha")
        await user.click(buttonRedefinir)

        expect(screen.getByText("Erro ao redefinir senha"))
    })
})