import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MoradoresList from "../MoradoresList";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import { Provider } from "react-redux";
import { apiSliceMoradores, useGetMoradoresQuery } from "../../../features/api/moradores/apiSliceMoradores";
import * as apiMoradores from "../../../features/api/moradores/apiSliceMoradores"

const store = {
  getState: jest.fn(),
  subscribe: jest.fn(),
  dispatch: jest.fn()
}
const mockMoradores = [
  { id: 1, nome: 'Andre Luis', sobrenome: 'Silva', bloco: 'A', apartamento: '101' },
  { id: 2, nome: 'Maria José', sobrenome: 'Oliveira', bloco: 'B', apartamento: '202' },
];

jest.mock('../../../features/api/moradores/apiSliceMoradores', () => ({
  useGetMoradoresQuery: jest.fn(() => ({data: mockMoradores, isLoading: false, isSuccess: true, isError: false, error: {status: null}}))
}))

const renderComponent = () => {
  return render (
    <Provider store={store}>
      <MemoryRouter>
            <MoradoresList />
      </MemoryRouter>
    </Provider>
  )
}

describe('Moradores List', () => {
beforeEach(() => {
  jest.clearAllMocks()
  apiMoradores.useGetMoradoresQuery.mockReturnValue({data: mockMoradores, isLoading: false, isSuccess: true, isError: false, error: {status: null}})
})

   test("should show loading indicator when isLoading is true", () => {
    apiMoradores.useGetMoradoresQuery.mockReturnValue({data: mockMoradores, isLoading: true, isSuccess: false, isError: false, error: {status: null}})
    renderComponent();
    
    let carregando = screen.getByText(/Carregando/i)


    expect(carregando).toBeInTheDocument();

  }) 
  test("should show moradores when isSuccess is true", () => {
    renderComponent()
    
    let andreMorador = screen.getByText(/Andre Luis/i)
    let mariaMorador = screen.getByText(/Maria José/i)

    expect(andreMorador).toBeInTheDocument();
    expect(mariaMorador).toBeInTheDocument();

  }) 
   test("should show 'Usuario deslogado' when isError is true and error.status is null", () => {
    apiMoradores.useGetMoradoresQuery
    .mockReturnValue({data: mockMoradores, isLoading: false, isSuccess: false, isError: true, error: {status: null}})
    renderComponent();
    
    let logged = screen.getByText(/Usuário deslogado. Você será.*/i)

    expect(logged).toBeInTheDocument();

  })
  test("should show 'Serviço indisponível' when isError is true and error.status is FETCH_ERROR", () => {
    apiMoradores.useGetMoradoresQuery
    .mockReturnValue({data: mockMoradores, isLoading: false, isSuccess: false, isError: true, error: {status: "FETCH_ERROR"}})
    renderComponent();
    
    let logged = screen.getByText(/Serviço indisponível. Você será.*/i)

    expect(logged).toBeInTheDocument();

  })
   

  test("should have 2 moradores", () => {
    render(<MoradoresList isError={false} isSuccess={true} isLoading={false} moradores={mockMoradores}/>, { wrapper: MemoryRouter })
    
    let listOfMoradores = screen.getAllByTestId("quantity")

    expect(listOfMoradores.length).toBe(2);

  })

  test("should show input nome do morador if selected nome no modo busca", () =>{
    render(
      <MoradoresList isError={false} isSuccess={true} isLoading={false} moradores={mockMoradores}/>, { wrapper: MemoryRouter }
    )

    const selectElement = screen.getByTestId("select");
    fireEvent.change(selectElement, {target: {value : "nome"}});
    const inputElement = screen.getByPlaceholderText(/Nome do morador/i)

    expect(inputElement).toBeInTheDocument()
  })

  test("should show input Apartamento e Bloco if selected bloco-apartamento no modo busca", () =>{
    render(
      <MoradoresList isError={false} isSuccess={true} isLoading={false} moradores={mockMoradores}/>, { wrapper: MemoryRouter }
    )

    const selectElement = screen.getByTestId("select");
    fireEvent.change(selectElement, {target: {value : "bloco-apartamento"}});
    const apartamentoElement = screen.getByPlaceholderText(/Apartamento/i)
    const blocoElement = screen.getByPlaceholderText(/Bloco/i)

    expect(apartamentoElement).toBeInTheDocument()
    expect(blocoElement).toBeInTheDocument()
  })

})