import "@testing-library/jest-dom"
import { fireEvent, render, screen, within } from "@testing-library/react"
import user from "@testing-library/user-event"
import RegistrarEntrada from '../RegistrarEntrada'
import { useParams } from "react-router"
import { apiPrestadorSlice, getPrestadorPeloId } from "../../../features/api/prestadores/apiPrestadorSlice"
import { useDispatch, useSelector } from "react-redux"
import { apiSliceMoradores, useGetMoradoresQuery } from "../../../features/api/moradores/apiSliceMoradores"
import { apiSliceServicosPrestados, useAddServicoPrestadoMutation } from "../../../features/api/servicos/apiServicosPrestados"
import React from "react"


const mockPrestador = {
    id: "1",
    nome: "Bonifacio",
    sobrenome: "Rezende",
    empresa: "BR servicos",
    numeroDocumento: "123.456.789-89",
    foto: "",
    idVeiculo: "",
    servicoPrestado: "drenagem de dutos"
};
const mockMoradores = [
    { id: 1, nome: 'Andre Luis', sobrenome: 'Silva', bloco: 'A', apartamento: '101' },
    { id: 2, nome: 'Maria José', sobrenome: 'Oliveira', bloco: 'B', apartamento: '202' },
];
const mockAddServico = jest.fn();
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn((selectorFn) => selectorFn({})),
    useDispatch: jest.fn()
}))

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(() => ({ idPrestador: "1" }))
}))

jest.mock("../../../features/api/prestadores/apiPrestadorSlice", () => ({
    getPrestadorPeloId: jest.fn(() => (mockPrestador))
}))

jest.mock("../../../features/api/moradores/apiSliceMoradores", () => ({
    useGetMoradoresQuery: jest.fn(() => ({ data: mockMoradores, error: false, isError: false }))
}))

jest.mock("../../../features/api/servicos/apiServicosPrestados", () => ({
    useAddServicoPrestadoMutation: jest.fn(() => ([mockAddServico]))
}))



const renderComponent = () => {
    return render(

        <RegistrarEntrada />
    )
}
describe("Registrar Entrada", () => {
    beforeEach(() => {

    })

    test("deve renderizar corretamente", async () => {
        renderComponent();
        expect(screen.getByRole('heading', { name: /buscar morador/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 6, name: /bonifacio/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 6, name: /buscar morador/i })).toBeInTheDocument()
        expect(screen.getByTestId(/modo-de-busca/i)).toBeInTheDocument();
        expect(screen.getByText(/^Nome$/i)).toBeInTheDocument();
        let menuItemBlocApartamento = screen.queryByText(/^apartamento-bloco$/i)
        expect(menuItemBlocApartamento).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirmar entrada/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /Dados da Prestação de Serviço/i })).toBeInTheDocument()
        const select = screen.getByTestId(/select/i);
        expect(select).toBeInTheDocument()
        fireEvent.change(select, { target: { value: 'apartamento/bloco' } })
        menuItemBlocApartamento = screen.getByText(/apartamento-bloco/i)
        expect(menuItemBlocApartamento).toBeInTheDocument()


    })
    test("deve filtrar o morador corretamente", async () => {
        renderComponent();

        const inputNomeMorador = screen.getByLabelText(/Nome do morador/i)
        expect(inputNomeMorador).toBeInTheDocument();
        await user.type(inputNomeMorador, "Andre L")
        expect(screen.getByText(/Andre Luis/i)).toBeInTheDocument()

        await user.clear(inputNomeMorador)

        await user.type(inputNomeMorador, "Maria")
        const morador = screen.getByText(/Maria José/i)
        expect(morador).toBeInTheDocument()
        //clica para escolher o morador
        await user.click(morador)

        //dados do morador deve ser inserido na seção Dados da Prestação de Serviço
        expect(screen.getByTestId(/nome-morador/i)).toHaveTextContent("Nome: Maria José Oliveira")
        expect(screen.getByTestId(/bloco-apt/i)).toHaveTextContent("Apartamento: 202 | B")

    })

    test('deve confirmar entrada corretamente', async () => {

        renderComponent();

        const inputNomeMorador = screen.getByLabelText(/Nome do morador/i)
        await user.type(inputNomeMorador, "Andre L")
        const morador = screen.getByText(/Andre Luis/i)
        expect(morador).toBeInTheDocument()
        await user.click(morador);

        const servico = screen.getByLabelText('Tipo de Serviço')
        const observacao = screen.getByLabelText('Observações')

        await user.type(servico, "servico")
        await user.type(observacao, "observacao")

        expect(servico.value).toBe("servico")
        

        const btnConfirmar = screen.getByRole('button', { name: /confirmar entrada/i });
        expect(btnConfirmar).toBeInTheDocument()

        await user.click(btnConfirmar)

        expect(mockAddServico).toHaveBeenCalled()
        expect(mockAddServico).toHaveBeenCalledWith({
            entregaServico:
            {
                idPrestadorDeServico: "1",
                idMorador: 1,
                tipoDeServico: "servico",
                observacaoSobreServico: "observacao"
            }
        })

    })


})

