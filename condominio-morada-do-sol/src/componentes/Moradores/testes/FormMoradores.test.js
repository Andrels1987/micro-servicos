import React from "react";
import FormMoradores from "../FormMoradores.js";
import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { Provider } from "react-redux";
import '@testing-library/jest-dom';
import { apiSliceMoradores, useAddMoradorMutation } from "../../../features/api/moradores/apiSliceMoradores.js";
import 'whatwg-fetch';
import { configureStore } from "@reduxjs/toolkit";

const mockStore = configureStore({
    reducer:  {
        // Mock do reducer para o apiSliceMoradores
        apiSliceMoradores: apiSliceMoradores.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSliceMoradores.middleware)
});

describe("FormMoradores", () => {

    it('should render correctly', async () => {
        render(
            <Provider store={mockStore}>
                <FormMoradores />
            </Provider>
        )


        expect(await screen.getByText("Salvar Morador")).toBeInTheDocument();
        expect(await screen.getByPlaceholderText("nome")).toBeInTheDocument();
        expect(await screen.getByPlaceholderText("sobrenome")).toBeInTheDocument();
        expect(await screen.getByRole("button", { name: /salvar morador/i })).toBeInTheDocument();
    })
})

test("o useState deve permitir escrever os textos nos inputs", () => {
    render(
        <Provider store={mockStore}>
            <FormMoradores />
        </Provider>
    )

    const nameInput = screen.getByPlaceholderText("nome");
    fireEvent.change(nameInput, { target: { value: "João" } });

    expect(nameInput.value).toBe("João");
})

test("Deve disparar a função ao clicar o botão ", () => {

    const addMoradorMock = jest.fn();

    // Atualizando o mock de useAddMoradorMutation para retornar a função mockada
    jest.spyOn(require("../../../features/api/moradores/apiSliceMoradores.js"), "useAddMoradorMutation").mockReturnValue([addMoradorMock, {}]);

    render(
        <Provider store={mockStore}>
            <FormMoradores />
        </Provider>
    );

    const btnSalvar = screen.getByRole("button", { name: /salvar morador/i });
    fireEvent.click(btnSalvar);

    // Verifica se a função mockada foi chamada
    expect(addMoradorMock).toHaveBeenCalled();


})


describe('HandleAddMorador', () => {
    let addMoradorMock;
    beforeEach(() => {
        addMoradorMock = jest.fn();
    })
    test("should fire addMorador function", () => {

        render(
            <Provider store={mockStore}>
                <FormMoradores />
            </Provider>
        )

        const btn = screen.getByRole("button", {name: /salvar morador/i});
        fireEvent.click(btn)

    })

})



