import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import PerfilRegistro from "../PerfilRegistro"
import React from "react"
import { useDispatch } from "react-redux"
import { apiSliceServicosPrestados, useGetServicosPrestadosQuery, useRegistrarEncerramentoDoServicoMutation } from "../../../features/api/servicos/apiServicosPrestados"
import { MemoryRouter, useParams } from "react-router-dom"
import * as apiServicos from "../../../features/api/servicos/apiServicosPrestados"
import user from "@testing-library/user-event"
const mockServicos = [
    {
        id: "1",
        morador: {
            id: "2",
            nome: "Osvaldo",
            apartamento: "1201",
            bloco: "C"
        },
        prestador: {
            nome: "Heleno",
            id: 3,
        },
        observacaoSobreServico: "Nenhuma observação",
        dataInicioDoServico: "2025-04-16T14:44:47.817",
        dataEncerramentoDoServico: "2025-04-16T14:45:02.364",
        tipoDeServico: "tipo de servico",
    }
]

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(() => ({ idRegistro: "1" }))
}))
jest.mock("react-redux", () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => jest.fn())
}))

jest.mock("../../../features/api/servicos/apiServicosPrestados", () => ({
    useRegistrarEncerramentoDoServicoMutation: jest.fn(() => ([jest.fn()])),
    useGetServicosPrestadosQuery: jest.fn(() => (
        { data: mockServicos, isLoading: false }
    ))
}))



const renderComponent = () => {
    return render(
        <MemoryRouter>
            <PerfilRegistro />
        </MemoryRouter>
    )

}

describe("Perfil Registro", () => {
    user.setup()
    beforeAll(() => {
        window.alert = jest.fn()
    })
    beforeEach(() => {
        jest.clearAllMocks()
        useParams.mockReturnValue({ idRegistro: '1' })
        apiServicos.useRegistrarEncerramentoDoServicoMutation.mockReturnValue([jest.fn()])
        apiServicos.useGetServicosPrestadosQuery.mockReturnValue({ data: mockServicos })
    })
    test('should render correctly if no registros was found', () => {
        apiServicos.useGetServicosPrestadosQuery.mockReturnValue({ data: null })

        renderComponent()

        expect(screen.getByText(/Carregando registro/i)).toBeInTheDocument()

    })
    test('should render correctly if registro was found', () => {

        renderComponent()

        expect(screen.getByText(/Prestador de serviço/i)).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Ver perfil do Prestador/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /Morador/i })).toBeInTheDocument()
        expect(screen.getByText('Apt: 1201 | Bloco: C')).toBeInTheDocument()
        expect(screen.getByText('Detalhes do Serviço')).toBeInTheDocument()
        expect(screen.getByText('Tipo: tipo de servico')).toBeInTheDocument()
        expect(screen.getByText('Observação: Nenhuma observação')).toBeInTheDocument()
        expect(screen.getByText('Entrada: 16-04-2025 14:44:47')).toBeInTheDocument()
        expect(screen.getByText('Saída: 16-04-2025 14:45:02')).toBeInTheDocument()
        const finalizarServicoBtn = screen.getByRole('button', { name: /finalizar serviço/i })
        expect(finalizarServicoBtn).toBeInTheDocument()
        expect(finalizarServicoBtn.disabled).toBe(true)

    })
    test("botão finalizar serviço deve estar habilitado se não tiver data de saida", () => {
        const [servico] = mockServicos;
        const modifiedServico = [{...servico, dataEncerramentoDoServico: null}]
        useParams.mockReturnValue({idRegistro: "1"})
        apiServicos.useGetServicosPrestadosQuery.mockReturnValue({data: modifiedServico, isLoading: false})

        renderComponent()
        const finalizarServicoBtn = screen.getByRole('button', { name: /finalizar serviço/i })
        expect(finalizarServicoBtn).toBeInTheDocument()
        expect(finalizarServicoBtn.disabled).toBe(false)

    })

    test('should encerrar serviço corretamente', async() => { 
        const mockUnwap = jest.fn().mockResolvedValue({})
        const [servico] = mockServicos;
        const mockFinalizarServico = jest.fn(() => ({
            unwrap: mockUnwap
        }));
        useParams.mockReturnValue({idRegistro: "1"})
        const modifiedServico = [
            {...servico, dataEncerramentoDoServico: null}
        ]
        apiServicos.useGetServicosPrestadosQuery.mockReturnValue({data: modifiedServico, isLoading: false})
        apiServicos.useRegistrarEncerramentoDoServicoMutation.mockReturnValue([mockFinalizarServico])
        renderComponent()

        const finalizarServicoBtn = screen.getByRole('button', {name: /finalizar serviço/i})

        await user.click(finalizarServicoBtn);

        expect(mockFinalizarServico).toHaveBeenCalled()
        expect(mockFinalizarServico).toHaveBeenCalledTimes(1)
     })
})





