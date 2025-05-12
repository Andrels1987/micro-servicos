import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import user from "@testing-library/user-event"
import React from "react"
import EsqueceSenha from "../EsqueceSenha"
import { Provider } from "react-redux"
import { useSendEmailMutation } from "../../../features/api/autenticacao/apiSliceAuth"

import * as api from '../../../features/api/autenticacao/apiSliceAuth'
import Profile from "../../Profile"






describe("EsqueceSenha", () => {
    beforeEach(() => {
    })
    user.setup()
    const store = {
        getState: jest.fn(),
        subscribe: jest.fn()
    }
    test('should render correctly', async () => {

        render(
            <Provider store={store}>
                <EsqueceSenha />

            </Provider>
        )

        const input = screen.getByPlaceholderText("email")
        const button = screen.getByRole('button', { name: /enviar/i })
        const textResponse = screen.getByTestId(/textresponse/i)

        expect(input).toBeInTheDocument()
        expect(button).toBeInTheDocument()
        expect(textResponse).toBeInTheDocument()

    })

    test('should validate email', async () => {
        render(
            <Provider store={store}>
                <EsqueceSenha />

            </Provider>
        )

        const input = screen.getByPlaceholderText("email")
        const button = screen.getByRole('button', { name: /enviar/i })
        const textResponse = screen.getByTestId(/textresponse/i)

        await user.type(input, "alspersonal@gmail")
        await user.click(button)


        expect(textResponse.textContent).toBe('Email inválido')

    })

    test('should send email successfully', async () => {
        const mockUnwrap = jest.fn(() => new Promise(res => setTimeout(() => res({ response: 'Email enviado com sucesso' }), 50)));
        const mockSendEmail = () => ({
            //A funçao useSendEmaulQuery retorna um objeto que possui um campo/metodo unwrap e esse unwrap retorna a resposta da
            //requisição.
            unwrap: mockUnwrap
        });
        jest.spyOn(api, 'useSendEmailMutation').mockReturnValue([mockSendEmail]);
        render(
            <Provider store={store}>
                <EsqueceSenha />
            </Provider>
        );

        const input = screen.getByPlaceholderText("email");
        const button = screen.getByRole('button', { name: /enviar/i });

        await user.type(input, "alspersonal@gmail.com");
        await user.click(button);

        // Primeiro, deve exibir "Enviando email...."
        expect(screen.getByTestId("textresponse").textContent).toBe("Enviando email....");

        // Depois, aguarda aparecer a resposta do servidor mockado
        await waitFor(() => {
            expect(screen.getByTestId("textresponse").textContent).toBe("Email enviado com sucesso");
        });

    })
    test('should show "Serviço indisponivel" on FETCH_ERROR', async () => {
        const mockUnwrap = jest.fn(() => new Promise((_, reject) => setTimeout(() => reject({ status: 'FETCH_ERROR' }), 50)));

        const mockSendEmail = () => ({
            //A funçao useSendEmailQuery retorna um objeto que possui um campo/metodo unwrap e esse unwrap retorna a resposta da
            //requisição.
            unwrap: mockUnwrap
        });
        jest.spyOn(api, 'useSendEmailMutation').mockReturnValue([mockSendEmail]);
        render(
            <Provider store={store}>
                <EsqueceSenha />
            </Provider>
        );

        const input = screen.getByPlaceholderText("email");
        const button = screen.getByRole('button', { name: /enviar/i });

        await user.type(input, "alspersonal@gmail.com");
        await user.click(button);

        // Primeiro, deve exibir "Enviando email...."
        expect(screen.getByTestId("textresponse").textContent).toBe("Enviando email....");

        // Depois, aguarda aparecer a resposta do servidor mockado
        await waitFor(() => {
            expect(screen.getByTestId("textresponse").textContent).toBe("Serviço indisponivel");
        });

    })

    test('should show "erro desconhecido" on error 500', async () => {
        const mockUnwrap = jest.fn(() => new Promise((_, reject) => setTimeout(() => reject({status: 500}),50)))
        const mockSendEmail = jest.fn(() => ({unwrap: mockUnwrap }))
        jest.spyOn(api, "useSendEmailMutation").mockReturnValue([mockSendEmail])

        render(
            <Provider store={store} >
                <EsqueceSenha />
            </Provider>
        )
        const input = screen.getByPlaceholderText("email");
        const button = screen.getByRole('button', { name: /enviar/i });

        await user.type(input, "alspersonal@gmail.com");
        await user.click(button);

        // Primeiro, deve exibir "Enviando email...."
        expect(screen.getByTestId("textresponse").textContent).toBe("Enviando email....");

        // Depois, aguarda aparecer a resposta do servidor mockado
        await waitFor(() => {
            expect(screen.getByTestId("textresponse").textContent).toBe("Erro desconhecido");
        });

    })
})