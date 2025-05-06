import React from "react";
import FormMoradores from "../FormMoradores.js";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, useParams } from "react-router";
import user from "@testing-library/user-event";
import {
  apiSliceMoradores,
  useAddMoradorMutation,
  useUpdateMoradorMutation,
  useGetMoradorPeloIdQuery
} from "../../../features/api/moradores/apiSliceMoradores.js";

// Setup geral
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn()
}));

const mockUnwrap = jest.fn().mockResolvedValue({});
const mockAddMorador = jest.fn(() => ({ unwrap: mockUnwrap }));
const mockUpdateMorador = jest.fn(() => ({ unwrap: mockUnwrap }));

const mockMorador = {
  id: "1",
  nome: "Andre",
  sobrenome: "Luis",
  apartamento: "1202",
  bloco: "C",
  foto: "",
  telefone: "21999999999",
  documento: "123456789",
  veiculos: [],
  dependentes: [],
  criadoEm: "",
};

// Mocks dos hooks
jest.mock('../../../features/api/moradores/apiSliceMoradores.js', () => ({
  useAddMoradorMutation: jest.fn(() => [mockAddMorador]),
  useUpdateMoradorMutation: jest.fn(() => [mockUpdateMorador]),
  useGetMoradorPeloIdQuery: jest.fn(() => ({ data: mockMorador })),
  apiSliceMoradores: {
    reducerPath: 'apiSliceMoradores',
    reducer: {
      queries: {},
      providers: {},
      mutations: {},
      subscriptions: {}
    }
  }
}));

const mockStore = configureStore({
  reducer: {
    [apiSliceMoradores.reducerPath]: () => apiSliceMoradores.reducer,
  }
});

user.setup();
window.alert = jest.fn();

const renderForm = () =>
  render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <FormMoradores />
      </MemoryRouter>
    </Provider>
  );

//
// TESTES - MODO EDIÇÃO
//
describe("FormMoradores - edição", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: mockMorador.id });
    require("../../../features/api/moradores/apiSliceMoradores.js").useUpdateMoradorMutation.mockReturnValue([mockUpdateMorador]);
    require("../../../features/api/moradores/apiSliceMoradores.js").useAddMoradorMutation.mockReturnValue([mockAddMorador]);
    require("../../../features/api/moradores/apiSliceMoradores.js").useGetMoradorPeloIdQuery.mockReturnValue({ data: mockMorador });
  });

  test("deve renderizar corretamente com dados preenchidos", () => {
    renderForm();

    expect(screen.getByText("Salvar Morador")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^nome/i).value).toBe("Andre");
    expect(screen.getByPlaceholderText(/sobrenome/i).value).toBe("Luis");
  });

  test("deve permitir digitar nos inputs", async () => {
    renderForm();

    const nameInput = screen.getByPlaceholderText(/^nome/i);
    await user.clear(nameInput);
    await user.type(nameInput, "João");
    expect(nameInput.value).toBe("João");
  });

  test("deve chamar updateMorador ao salvar", async () => {
    renderForm();

    const btnSalvar = screen.getByRole("button", { name: /salvar morador/i });
    await user.click(btnSalvar);
    expect(mockUpdateMorador).toHaveBeenCalled();
  });
});

//
// TESTES - MODO CRIAÇÃO
//
describe("FormMoradores - criação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: null });
    require("../../../features/api/moradores/apiSliceMoradores.js").useGetMoradorPeloIdQuery.mockReturnValue({ data: null });
    require("../../../features/api/moradores/apiSliceMoradores.js").useAddMoradorMutation.mockReturnValue([mockAddMorador]);
  });

  test("deve adicionar morador ao clicar em salvar", async () => {
    renderForm();

    await user.type(screen.getByPlaceholderText(/^nome/i), "João");
    await user.type(screen.getByPlaceholderText(/sobrenome/i), "Maria");
    await user.type(screen.getByPlaceholderText(/apartamento/i), "1202");
    await user.type(screen.getByPlaceholderText(/bloco/i), "C");

    const btn = screen.getByRole("button", { name: /salvar morador/i });
    await user.click(btn);

    expect(mockAddMorador).toHaveBeenCalled();
  });
});
