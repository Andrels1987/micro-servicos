import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MoradoresList from "../MoradoresList";
import { MemoryRouter } from "react-router";
import '@testing-library/jest-dom';




describe('Moradores List', () => {

  const mockMoradores = [
    { id: 1, nome: 'Andre Luis', sobrenome: 'Silva', bloco: 'A', apartamento: '101' },
    { id: 2, nome: 'Maria José', sobrenome: 'Oliveira', bloco: 'B', apartamento: '202' },
  ];

  test("should show loading indicator when isLoading is true", () => {
    render(<MoradoresList isLoading={true} />, { wrapper: MemoryRouter })
    
    let carregando = screen.getByText(/Carregando/i)


    expect(carregando).toBeInTheDocument();

  })
  test("should show moradores when isSuccess is true", () => {
    render(<MoradoresList isSuccess={true} moradores={mockMoradores}/>, { wrapper: MemoryRouter })
    
    let nome = screen.getByText(/João/i)

    expect(nome).toBeInTheDocument();

  })
  test("should show 'Usuario deslogado' when isError is true", () => {
    render(<MoradoresList isError={true} moradores={mockMoradores}/>, { wrapper: MemoryRouter })
    
    let logged = screen.getByText(/Usuario deslogado/i)

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