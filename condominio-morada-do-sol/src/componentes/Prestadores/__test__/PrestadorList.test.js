import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import '@testing-library/jest-dom';
import PrestadorList from "../PrestadorList";
import user from "@testing-library/user-event"
import PerfilPrestador from "../PerfilPrestador";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { apiSliceServicosPrestados } from "../../../features/api/servicos/apiServicosPrestados";

import { apiPrestadorSlice, deletePrestador, fetchPrestadores } from '../../../features/api/prestadores/apiPrestadorSlice'
import Formprestador from "../FormPrestador";
import FormPrestador from "../FormPrestador";


const dataServicos = {
    data: [
        {
            idPrestadorDeServico: 1,
            idMorador: 1,
            tipoDeServico: "servico 1",
            observacaoSobreServico: "observação 1"
        },
        {
            idPrestadorDeServico: 2,
            idMorador: 1,
            tipoDeServico: "servico 2",
            observacaoSobreServico: "observação 2"
        },

    ],
    isLoading: false,
    isError: false,
}

const dataPrestadores = {
    data: [
        { foto: "", id: 1, nome: 'Andre Luis', empresa: "Cristal", numeroDocumento: "1234567890" },
        { foto: "", id: 2, nome: 'Maria José', empresa: "Rio Farma", numeroDocumento: "1234567891" }
    ],
    isLoading: false,
    isError: false,
}

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))
jest.mock("../../../features/api/prestadores/apiPrestadorSlice", () => ({
    getPrestadores: jest.fn(() => (dataPrestadores.data)),
    getPrestadorPeloId: jest.fn(() => ({})),
    fetchPrestadores: jest.fn(),
    deletePrestador: jest.fn(),
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
jest.mock("../../../features/api/servicos/apiServicosPrestados", () => ({
    useGetServicosPrestadosQuery: jest.fn(() => ({ data: [] })),
    apiSliceServicosPrestados: {
        reducer: {
            queries: {},
            mutations: {},
            provided: {},
            subscriptions: {},
        },
        reducerPath: "apiServicosPrestados"
    }
}));
const store = configureStore({
    reducer: {
        [apiPrestadorSlice.reducerPath]: () => apiPrestadorSlice.reducer,
        [apiSliceServicosPrestados.reducerPath]: () => apiSliceServicosPrestados.reducer
    }
});

const renderComponent = () => {
    return render(
        <Provider store={store}>
                <MemoryRouter initialEntries={["/prestadores"]}>
                    <Routes>
                        <Route path="/prestadores" element={<PrestadorList prestadores={dataPrestadores.data} />} />
                        <Route path="/prestadores/perfil-prestador/:idPrestador" element={<PerfilPrestador />} />
                        <Route path={"/prestadores/add-prestador"} element={<FormPrestador />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
    )
}

describe("PrestadoresList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        user.setup()
        useSelector.mockImplementation((selectorFn) => selectorFn(dataPrestadores.data))
        useDispatch.mockReturnValue(jest.fn())
        require("../../../features/api/prestadores/apiPrestadorSlice")
            .getPrestadores.mockReturnValue(dataPrestadores.data)

        

        require("../../../features/api/servicos/apiServicosPrestados")
            .useGetServicosPrestadosQuery.mockReturnValue([dataServicos.data])
    });






    test('should show the select "Modo de busca" when rendered', () => {
        renderComponent()

        const modoBuscaElement = screen.getByTestId(/modo-busca/i);
        expect(modoBuscaElement).toBeInTheDocument();

    })
     test('should show the form "Modo de busca" when rendered', () => {
        renderComponent()

        const modoBuscaFormElement = screen.getByRole("form", { name: 'form-modo-busca' });
        expect(modoBuscaFormElement).toBeInTheDocument();

    })

    test('should show the input name if "Modo de busca" for nome', () => {
        renderComponent()
        const selectedElement = screen.getByLabelText(/Modo de busca/i)
        fireEvent.change(selectedElement, { target: { value: 'nome' } });
        const modoBuscaInputElement = screen.getByPlaceholderText(/Nome do prestador/i);
        expect(modoBuscaInputElement).toBeInTheDocument();

    })

    test('should show the input documento if "Modo de busca" for documento', () => {
        renderComponent()
        const selectedElement = screen.getByLabelText(/Modo de busca/i)
        fireEvent.change(selectedElement, { target: { value: 'documento' } });
        const modoBuscaInputElement = screen.getByPlaceholderText(/Documento/i);
        expect(modoBuscaInputElement).toBeInTheDocument();

    })
    test('should render prestadores correctly', () => {
        renderComponent()
        const prestadorElement = screen.getByText(/Andre Luis/i)
        expect(prestadorElement).toBeInTheDocument();

    })


    test('should render all prestadores correctly', () => {
        renderComponent()
        const prestadorElement = screen.getAllByTestId(/prestador/i)
        expect(prestadorElement.length).toBe(2);

    })
    

    test("should go to prestador profile", async () => {
        
        require("../../../features/api/prestadores/apiPrestadorSlice")
            .getPrestadorPeloId
                .mockReturnValue(dataPrestadores.data.find(p => p.nome.includes("Andre Luis")))
        
        renderComponent()

        // Find and click the correct list item
        const prestadorItemElem = screen.getAllByTestId("prestador");
        const item = prestadorItemElem.find(i => i.textContent.includes("Andre Luis"));


        expect(item).toBeInTheDocument(); // Ensure item exists

        await user.click(item);

        // Wait for navigation and check if profile page appears
        const profile = screen.getByText("Andre Luis")
        const headingEmpresa = screen.getByRole("heading", {name: /empresa: Cristal/i})
        const headingDoc = screen.getByRole("heading", {name: /documento: 1234567890/i})



        await waitFor(() => {
            expect(profile).toBeInTheDocument();
            expect(headingEmpresa).toBeInTheDocument();
            expect(headingDoc).toBeInTheDocument();
        });
    });

   



    test('should filter by nome ', async () => {

        
        
        renderComponent()
        const inputFilterPrestador = screen.getByPlaceholderText("Nome do prestador")
        expect(inputFilterPrestador).toBeInTheDocument()
        await user.type(inputFilterPrestador, "Maria");

        const mariaItem = screen.getByText("Maria José")
        const andreItem = screen.queryByText("Andre Luis")

        expect(mariaItem).toBeInTheDocument();
        expect(andreItem).not.toBeInTheDocument();


    })

    test('should filter by document ', async () => {

        
        
        renderComponent()
        const inputFilterPrestador = screen.getByPlaceholderText("Nome do prestador")
        expect(inputFilterPrestador).toBeInTheDocument()

        const selectModoBusca = screen.getByLabelText(/modo de busca/i);
        await user.selectOptions(selectModoBusca, "documento");
        const inputDocumento = screen.getByPlaceholderText(/documento/i);
        expect(inputDocumento).toBeInTheDocument();
        await user.type(inputDocumento, "1234567891")

        await waitFor(() => {

            expect(inputDocumento.value).toBe("1234567891");
            const mariaItem = screen.queryByText("Maria José")
            const andreItem = screen.queryByText("Andre Luis");
            expect(mariaItem).toBeInTheDocument();
            expect(andreItem).not.toBeInTheDocument();
        })
    }) 



     test('should show Nenhum prestador encontrado if prestadores list is empty', () => {
        require("../../../features/api/prestadores/apiPrestadorSlice")
            .getPrestadores.mockReturnValue([])
        renderComponent()
        const headingElement = screen.getByRole("heading", { level: 1 })
        expect(headingElement.textContent).toBe("Nenhum prestador encontrado");

    }) 

      test('should go do add prestador page when clicking the button ', async () => {

        


        renderComponent()
        const btnAddPrestador = screen.getByRole("link", { name: "+" })
        expect(btnAddPrestador).toBeInTheDocument()
        await user.click(btnAddPrestador);

        const addPage = screen.getByText("Salvar Prestador")

        await waitFor(() => {
            expect(addPage).toBeInTheDocument();
        })

    }) 
    test('should call handle delete when clickig the button', async () => {
        
        useSelector.mockImplementation((selectorFn) => selectorFn({}))
        require("../../../features/api/prestadores/apiPrestadorSlice")
            .getPrestadorPeloId.mockReturnValue(dataPrestadores.data.find(p => p.nome === "Maria José"))
        
            renderComponent()

        // Find and click the correct list item
        const prestadorItemElem = screen.getAllByTestId("prestador");
        const item = prestadorItemElem.find(i => i.textContent.includes("Maria José"));


        expect(item).toBeInTheDocument(); // Ensure item exists

        await user.click(item);

        // Wait for navigation and check if profile page appears
        const profile = screen.getByText("Maria José")



        await waitFor(() => {
            expect(profile).toBeInTheDocument();
        });

        const deleteButton = screen.getByRole("button", { name: /deletar/i })

        expect(deleteButton).toBeInTheDocument()

        await user.click(deleteButton);

        expect(deletePrestador).toHaveBeenCalledTimes(1)
        expect(deletePrestador).toHaveBeenCalledWith({id: 2})


    })  

})