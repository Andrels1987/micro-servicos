import '@testing-library/jest-dom'
import React from 'react'
import FormPrestador from "../FormPrestador"
import {  render, screen } from '@testing-library/react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { apiPrestadorSlice,  } from '../../../features/api/prestadores/apiPrestadorSlice'
import { useParams } from 'react-router-dom'
import user from '@testing-library/user-event'

jest.mock('react-router-dom', ()=> ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}))
jest.mock('react-redux', ()=> ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}))

jest.mock('../../../features/api/prestadores/apiPrestadorSlice', ()=>({
    getPrestadores: jest.fn(() => ({data: []})),
    getPrestadorPeloId: jest.fn(() => ({})),
    updatePrestador: jest.fn(() => ({})),
    apiPrestadorSlice: {
        reducerPath: 'apiPrestadorSlice',
        reducer: {
            queries: {},
            mutations: {},
            providers: {},
            subscriptions: {}
        }
    }
}))

describe("FormPrestador", () =>{
    const mockDispatch = jest.fn();
    user.setup()

    const modeloPrestador = {
        nome: "Bonifacio", 
        sobrenome: "Rezende", 
        empresa: "BR servicos", 
        numeroDocumento: "123.456.789-89", 
        foto: "", 
        idVeiculo: "",
        servicoPrestado: "drenagem de dutos"
      };

    const store = configureStore({
        reducer: {
            [apiPrestadorSlice.reducerPath]: () => apiPrestadorSlice.reducer
        }
    })

    beforeEach(() =>{
        jest.clearAllMocks()
        useParams.mockReturnValue({idPrestador: '1'})
        useDispatch.mockReturnValue(mockDispatch);
        const api = require("../../../features/api/prestadores/apiPrestadorSlice");
        //mocando aimplementação do useSelector
        useSelector.mockImplementation((selectorFn) => selectorFn({}));
        api.getPrestadorPeloId.mockReturnValue(modeloPrestador);
        
    })


    test('should render correctly', () => { 
        
        render(
            <Provider store={store}>
                <FormPrestador />
            </Provider>
        )

        const buttonAdicionarVeiculo = screen.getByRole('button', {name: /adicionar veículo/i})
        const inputNome = screen.getByPlaceholderText('nome')
        const inputSobrenome = screen.getByPlaceholderText(/sobrenome/i)
        const inputEmpresa = screen.getByPlaceholderText(/empresa/i)
        const inputDocumento = screen.getByPlaceholderText(/documento/i)
        const inputServico = screen.getByPlaceholderText(/servico/i)
        expect(buttonAdicionarVeiculo).toBeInTheDocument();
        expect(inputNome).toBeInTheDocument();
        expect(inputSobrenome).toBeInTheDocument();
        expect(inputEmpresa).toBeInTheDocument();
        expect(inputDocumento).toBeInTheDocument();
        expect(inputServico).toBeInTheDocument();
     })

     test('should render correcty if prestador exists', () => { 
        
        render(
            <Provider store={store}>
                <FormPrestador />
            </Provider>
        )

        const inputNameFilled = screen.getByPlaceholderText("nome")
        expect(inputNameFilled).toBeInTheDocument()
        expect(inputNameFilled.value).toBe("Bonifacio")
      })
     test('should render correcty if prestador does not exist', () => { 
        const api = require("../../../features/api/prestadores/apiPrestadorSlice");
        api.getPrestadorPeloId.mockReturnValue({})
        render(
            <Provider store={store}>
                <FormPrestador />
            </Provider>
        )

        const inputNameFilled = screen.getByPlaceholderText("nome")
        expect(inputNameFilled).toBeInTheDocument()
        expect(inputNameFilled.value).toBe("")
      })

     test('should enable Salvar Prestador button if all the inputs are filled', async() => { 
        const api = require("../../../features/api/prestadores/apiPrestadorSlice");
        api.getPrestadorPeloId.mockReturnValue({})
        render(
            <Provider store={store}>
                <FormPrestador />
            </Provider>
        )

        const inputNome = screen.getByPlaceholderText('nome')
        const inputSobrenome = screen.getByPlaceholderText(/sobrenome/i)
        const inputEmpresa = screen.getByPlaceholderText(/empresa/i)
        const inputDocumento = screen.getByPlaceholderText(/documento/i)
        const inputServico = screen.getByPlaceholderText(/servico/i)

        await user.type(inputNome, "Andre");
        await user.type(inputSobrenome, "Luis");
        await user.type(inputEmpresa, "Drogaria Cristal");
        await user.type(inputDocumento, "123456789");
        await user.type(inputServico, "Entrega de medicamentos");

        const salvarButton = screen.getByRole('button', {name : /salvar prestador/i});
        //testing handle input change
        expect(salvarButton.disabled).toBe(false)
        expect(inputNome.value).toBe("Andre")
        expect(inputSobrenome.value).toBe("Luis")
        expect(inputEmpresa.value).toBe("Drogaria Cristal")
      })
     test('should submit prestador ', async() => { 
        const api = require("../../../features/api/prestadores/apiPrestadorSlice");
        api.getPrestadorPeloId.mockReturnValue({})
        render(
            <Provider store={store}>
                <FormPrestador />
            </Provider>
        )

        const inputNome = screen.getByPlaceholderText('nome')
        const inputSobrenome = screen.getByPlaceholderText(/sobrenome/i)
        const inputEmpresa = screen.getByPlaceholderText(/empresa/i)
        const inputDocumento = screen.getByPlaceholderText(/documento/i)
        const inputServico = screen.getByPlaceholderText(/servico/i)

        await user.type(inputNome, "Andre");
        await user.type(inputSobrenome, "Luis");
        await user.type(inputEmpresa, "Drogaria Cristal");
        await user.type(inputDocumento, "123456789");
        await user.type(inputServico, "Entrega de medicamentos");

        const salvarButton = screen.getByRole('button', {name : /salvar prestador/i});
        //testing handle input change
        await user.click(salvarButton);
        expect(mockDispatch).toHaveBeenCalled()
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(api.updatePrestador).toHaveBeenCalledTimes(1)
        
      })
})