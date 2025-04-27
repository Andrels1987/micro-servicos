import React from "react"; 
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import '@testing-library/jest-dom';
import PrestadorList from "../PrestadorList";
import user from "@testing-library/user-event"
import PerfilPrestador from "../PerfilPrestador";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { apiSliceServicosPrestados } from "../../../features/api/servicos/apiServicosPrestados";

import  { apiPrestadorSlice } from '../../../features/api/prestadores/apiPrestadorSlice'
import Formprestador from "../FormPrestador";

jest.mock("../../../features/api/prestadores/apiPrestadorSlice", () => ({
    getPrestadores: jest.fn(() => ({ data: [] })),
    getPrestadorPeloId: jest.fn(() => ({})),
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

describe("PrestadoresList", () => {

    const dataServicos  = {
        data: [
            { idPrestadorDeServico: 1,
                    idMorador: 1, 
                    tipoDeServico: "servico 1",
                    observacaoSobreServico: "observação 1" },
            { idPrestadorDeServico: 2,
                    idMorador: 1, 
                    tipoDeServico: "servico 2",
                    observacaoSobreServico: "observação 2" },
        
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

    beforeEach(() => {
        jest.clearAllMocks();
        require("../../../features/api/prestadores/apiPrestadorSlice")
            .getPrestadores.mockReturnValue([dataPrestadores.data])

        require("../../../features/api/servicos/apiServicosPrestados")
            .useGetServicosPrestadosQuery.mockReturnValue([dataServicos.data])
    });
    
  
   

    const createMockStore = () =>
        configureStore({
            reducer: {
                [apiPrestadorSlice.reducerPath]: () => apiPrestadorSlice.reducer,
                [apiSliceServicosPrestados.reducerPath]: () => apiSliceServicosPrestados.reducer                
            }            
        });
    test('should show the select "Modo de busca" when rendered', () => {
        render(
            <MemoryRouter>
                <PrestadorList prestadores={dataPrestadores.data} />
            </MemoryRouter>
        )

        const modoBuscaElement = screen.getByTestId(/modo-busca/i);
        expect(modoBuscaElement).toBeInTheDocument();

    })
     test('should show the form "Modo de busca" when rendered', () => {
        render(
            <MemoryRouter>
                <PrestadorList prestadores={dataPrestadores.data} />
            </MemoryRouter>
        )

        const modoBuscaFormElement = screen.getByRole("form", { name: 'form-modo-busca' });
        expect(modoBuscaFormElement).toBeInTheDocument();

    })
    
    test('should show the input name if "Modo de busca" for nome', () => {
        render(
            <MemoryRouter>
                <PrestadorList prestadores={dataPrestadores.data} />
            </MemoryRouter>
        )
        const selectedElement = screen.getByLabelText(/Modo de busca/i)
        fireEvent.change(selectedElement, { target: { value: 'nome' } });
        const modoBuscaInputElement = screen.getByPlaceholderText(/Nome do prestador/i);
        expect(modoBuscaInputElement).toBeInTheDocument();

    })

    test('should show the input documento if "Modo de busca" for documento', () => {
        render(
            <MemoryRouter>
                <PrestadorList prestadores={dataPrestadores.data} />
            </MemoryRouter>
        )
        const selectedElement = screen.getByLabelText(/Modo de busca/i)
        fireEvent.change(selectedElement, { target: { value: 'documento' } });
        const modoBuscaInputElement = screen.getByPlaceholderText(/Documento/i);
        expect(modoBuscaInputElement).toBeInTheDocument();

    })
    test('should render prestadores correctly', () => {
        render(
            <MemoryRouter>
                <PrestadorList prestadores={dataPrestadores.data} />
            </MemoryRouter>
        )
        const prestadorElement = screen.getByText(/Andre Luis/i)
        expect(prestadorElement).toBeInTheDocument();

    })
    
    
    test('should render all prestadores correctly', () => {
        render(
            <MemoryRouter>
                <PrestadorList prestadores={dataPrestadores.data} />
            </MemoryRouter>
        )
        const prestadorElement = screen.getAllByTestId(/prestador/i)
        expect(prestadorElement.length).toBe(2);

    })
    test('should show Nenhum prestador encontrado if prestadores list is empty', () => {
        render(
            <MemoryRouter>
                <PrestadorList prestadores={[]} />
            </MemoryRouter>
        )
        const headingElement = screen.getByRole("heading", { level: 1 })
        expect(headingElement.textContent).toBe("Nenhum prestador encontrado");

    })
      
    test("should go to prestador profile", async () => {
        const store = createMockStore()
        require("../../../features/api/prestadores/apiPrestadorSlice")
            .getPrestadorPeloId.mockReturnValue(dataPrestadores.data.find(p => p.nome.includes("Maria José")))
        user.setup();
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<PrestadorList prestadores={dataPrestadores.data} />} />
                        <Route path="perfil-prestador/:idPrestador" element={<PerfilPrestador />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Find and click the correct list item
        const prestadorItemElem = screen.getAllByTestId("prest-profile");
        const item = prestadorItemElem.find(i => i.textContent.includes("Maria José"));


        expect(item).toBeInTheDocument(); // Ensure item exists

        await user.click(item);

        // Wait for navigation and check if profile page appears
        const profile = screen.getByText("Maria José")



        await waitFor(() => {
            expect(profile).toBeInTheDocument();
        });
    });

    test('should go do add prestador page when clicking the button ', async () => {

        const store = createMockStore()
       
        user.setup()
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<PrestadorList prestadores={dataPrestadores.data} />} />
                        <Route path={"add-prestador"} element={<Formprestador token={""} />} />
                    </Routes>
                </MemoryRouter>
            </Provider>

        )
        const btnAddPrestador = screen.getByRole("link", { name: "+" })
        expect(btnAddPrestador).toBeInTheDocument()
        await user.click(btnAddPrestador);

        const addPage = screen.getByText("Salvar Prestador")

        await waitFor(() => {
            expect(addPage).toBeInTheDocument();
        })

    })

     

    test('should filter by nome ', async () => {

        const store = createMockStore()
        user.setup()
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<PrestadorList prestadores={dataPrestadores.data} />} />
                    </Routes>
                </MemoryRouter>
            </Provider>

        )
        const inputFilterPrestador = screen.getByPlaceholderText("Nome do prestador")
        expect(inputFilterPrestador).toBeInTheDocument()
        await user.type(inputFilterPrestador, "Maria");

        const mariaItem = screen.getByText("Maria José")
        const andreItem = screen.queryByText("Andre Luis")

        expect(mariaItem).toBeInTheDocument();
        expect(andreItem).not.toBeInTheDocument();


    })
   
    test('should filter by document ', async () => {

        const store = createMockStore()
        user.setup()
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<PrestadorList prestadores={dataPrestadores.data} />} />
                    </Routes>
                </MemoryRouter>
            </Provider>

        )
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
     


    test('should call handle delete when clickig the button', async () => {
        const store = createMockStore()
        user.setup()
        const deletarPrestador = jest.fn();
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<PrestadorList prestadores={dataPrestadores.data} />} />
                        <Route path="perfil-prestador/:idPrestador" token={{token: "mytoken"}} element={<PerfilPrestador handleDelete={deletarPrestador}/>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
     
        // Find and click the correct list item
        const prestadorItemElem = screen.getAllByTestId("prest-profile");
        const item = prestadorItemElem.find(i => i.textContent.includes("Maria José"));


        expect(item).toBeInTheDocument(); // Ensure item exists

        await user.click(item);

        // Wait for navigation and check if profile page appears
        const profile = screen.getByText("Maria José")



        await waitFor(() => {
            expect(profile).toBeInTheDocument();
        });

        const deleteButton = screen.getByRole("button", { name: "deletar" })

        expect(deleteButton).toBeInTheDocument()
        
        await user.click(deleteButton);
           
        expect(deletarPrestador).toHaveBeenCalledTimes(1)
        expect(deletarPrestador).toHaveBeenCalledWith(2,undefined)

        
    }) 
    
})