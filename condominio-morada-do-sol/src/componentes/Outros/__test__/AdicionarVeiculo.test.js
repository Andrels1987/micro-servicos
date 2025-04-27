import '@testing-library/jest-dom'
import '@testing-library/react'
import { render, screen } from '@testing-library/react'
import user from "@testing-library/user-event"
import React from 'react'
import AdicionarVeiculos from '../AdicionarVeiculos'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { configureStore } from '@reduxjs/toolkit'

//precisa estar entre chaves para o reducer funcionar
/** 
 *  The slice reducer for key "undefined" returned undefined during 
 * initialization. If the state passed to the reducer is undefined, 
 * you must explicitly return the initial state. The initial state may 
 * not be undefined. If you don't
 * want to set a value for this reducer, you can use null instead of undefined.
*/
import { veiculoApiSlice } from '../../../features/api/veiculos/veiculoApiSlice'
import { apiSliceMoradores } from '../../../features/api/moradores/apiSliceMoradores'



jest.mock('../../../features/api/veiculos/veiculoApiSlice', () => ({
    useGetVeiculosQuery: jest.fn(),
    useLazyGetVeiculoPeloIdQuery: jest.fn(),
    useLazyGetVeiculoPelaPlacaQuery: jest.fn(),
    useGetVeiculoPeloIdQuery: jest.fn(),
    useEnviarVeiculoMutation: jest.fn(),
    veiculoApiSlice: {
        reducerPath: 'veiculoSlice',
        reducer: {
            queries: {},
            mutations: {},
            subscriptions: {},
            providers: {}
        }
    }
}))
jest.mock('../../../features/api/moradores/apiSliceMoradores', () => ({
    useUpdateMoradorMutation: jest.fn(),
    apiSliceMoradores: {
        reducerPath: 'apiSliceMoradores',
        reducer: {
            queries: {},
            mutations: {},
            subscriptions: {},
            providers: {}
        }
    }
}))

describe('Adicinar Veiculo', () => {
    const morador = {
        apartamento: "1702",
        bloco: "A",
        criadoEm: null,
        dependentes: [],
        documento: "125.234.566-43",
        foto: "",
        id: "678d88620ed5f86a07c8e18e",
        modificadoEm: null,
        nome: "Ricardo",
        sobrenome: "Malfredo Junior",
        telefone: "21966873608",
    }
    const refetchMock = jest.fn();
    const enviarVeiculoMock = jest.fn();
    const buscarVeiculoMock = jest.fn(() => Promise.resolve({
        data: {
            placa: "RPG2R22",
            modelo: "Civic",
            marca: "Honda",
            cor: "Verde",
            vaga: "parqueamento",
            tipoDeAutorizacao: "permanente",
            status_de_acesso: "morador",
            nomeProprietario: "Andre",
            apartamento: "1203",
            bloco: "A",
            documentoProprietario: "123.456.789.0",
            observacao: "Nenhuma"
        }
    }));
    const atualizarMoradorMock = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks()
        const apiVeiculos = require("../../../features/api/veiculos/veiculoApiSlice")
        const apiMoradores = require("../../../features/api/moradores/apiSliceMoradores")

        apiVeiculos.useEnviarVeiculoMutation.mockReturnValue([enviarVeiculoMock])
        apiVeiculos.useLazyGetVeiculoPelaPlacaQuery.mockReturnValue([buscarVeiculoMock])
        apiMoradores.useUpdateMoradorMutation.mockReturnValue([atualizarMoradorMock])
    })

    const store = configureStore({
        //`reducer` is a required argument, and must be a function or an object of functions that can be passed to combineReducers
        reducer: {
            [veiculoApiSlice.reducerPath]: () => veiculoApiSlice.reducer,
            [apiSliceMoradores.reducerPath]: () => apiSliceMoradores.reducer
        }

    })

    test('should render correctly', async () => {

        user.setup();

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdicionarVeiculos />
                </MemoryRouter>
            </Provider>
        )

        const buttonAddElem = screen.getByRole('button', { name: "+" })
        expect(buttonAddElem).toBeInTheDocument();

        await user.click(buttonAddElem);
        const buttonAssociarElem = screen.getByRole('button', { name: /Associar ao morador/i })
        const buttonEnviarElem = screen.getByRole('button', { name: /Enviar/i })
        const buttonBuscarElem = screen.getByRole('button', { name: /buscar/i })
        const placaTextField = screen.getByLabelText('Placa')
        const modeloTextField = screen.getByLabelText('Modelo')
        const marcaTextField = screen.getByLabelText('Marca')
        const corTextField = screen.getByLabelText('Cor')
        const vagaTextField = screen.getByLabelText('Vaga')
        const autorizacaoTextField = screen.getByLabelText('Tipo de Autorização')
        const statusTextField = screen.getByLabelText('Status de Acesso')

        expect(buttonBuscarElem).toBeInTheDocument();
        expect(buttonBuscarElem.disabled).toBe(false);
        expect(buttonAssociarElem).toBeInTheDocument();
        expect(buttonAssociarElem.disabled).toBe(true);
        expect(buttonEnviarElem).toBeInTheDocument();
        expect(buttonEnviarElem.disabled).toBe(true);

        expect(placaTextField).toBeInTheDocument();
        expect(modeloTextField).toBeInTheDocument();
        expect(marcaTextField).toBeInTheDocument();
        expect(corTextField).toBeInTheDocument();
        expect(vagaTextField).toBeInTheDocument();
        expect(autorizacaoTextField).toBeInTheDocument();
        expect(statusTextField).toBeInTheDocument();
    })

    test('Should handle input change correctly', async () => {
        user.setup();
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdicionarVeiculos morador={morador} refetch={refetchMock} />
                </MemoryRouter>
            </Provider>
        )

        const buttonAddElem = screen.getByRole('button', { name: "+" })
        expect(buttonAddElem).toBeInTheDocument();
        await user.click(buttonAddElem);

        //handle change
        const placaTextField = screen.getByLabelText('Placa')
        const modeloTextField = screen.getByLabelText('Modelo')
        const marcaTextField = screen.getByLabelText('Marca')
        const corTextField = screen.getByLabelText('Cor')
        const vagaTextField = screen.getByLabelText('Vaga')
        const autorizacaoTextField = screen.getByLabelText('Tipo de Autorização')
        const statusTextField = screen.getByLabelText('Status de Acesso')

        //typing
        await user.type(placaTextField, 'RPG2R22')
        await user.type(modeloTextField, 'Civic')
        await user.type(marcaTextField, 'Honda')
        await user.type(corTextField, 'Verde')
        await user.type(vagaTextField, 'parqueamento')
        await user.type(autorizacaoTextField, 'permanente')
        await user.type(statusTextField, 'morador')

        //checking

        expect(placaTextField.value).toEqual('RPG2R22');
        expect(modeloTextField.value).toEqual('Civic');
        expect(marcaTextField.value).toEqual('Honda');
        expect(corTextField.value).toEqual('Verde');
        expect(vagaTextField.value).toEqual('parqueamento');
        expect(autorizacaoTextField.value).toEqual('permanente');
        expect(statusTextField.value).toEqual('morador');
    })

    test('should handle buscar Placa correctly', async () => {

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdicionarVeiculos morador={morador} refetch={refetchMock} />
                </MemoryRouter>
            </Provider>
        )
        const buttonAddElem = screen.getByRole('button', { name: "+" })
        
        expect(buttonAddElem).toBeInTheDocument();
        //opening the form       
        await user.click(buttonAddElem);

        const placaTextField = screen.getByLabelText('Placa') 
        const buttonBuscarElem = screen.getByRole('button', { name: /buscar/i })
        //typing
        await user.type(placaTextField, 'RPG2R22')
        //clicking buscar button
        await user.click(buttonBuscarElem)
        const modeloTextField = screen.getByLabelText('Modelo')
        const marcaTextField = screen.getByLabelText('Marca')
        const corTextField = screen.getByLabelText('Cor')
        const vagaTextField = screen.getByLabelText('Vaga')
        const autorizacaoTextField = screen.getByLabelText('Tipo de Autorização')
        const statusTextField = screen.getByLabelText('Status de Acesso')
        const buttonAssociarElem = screen.getByRole('button', { name: /Associar ao morador/i })
        const buttonEnviarElem = screen.getByRole('button', { name: /Enviar/i })

        expect(placaTextField.value).toEqual('RPG2R22');
        expect(modeloTextField.value).toEqual('Civic');
        expect(marcaTextField.value).toEqual('Honda');
        expect(corTextField.value).toEqual('Verde');
        expect(vagaTextField.value).toEqual('parqueamento');
        expect(autorizacaoTextField.value).toEqual('permanente');
        expect(statusTextField.value).toEqual('morador');
        expect(buttonAssociarElem.disabled).toBe(false);
        expect(buttonEnviarElem.disabled).toBe(true);


    })

    test('should handle buscar error correctly', async () => {
        let buscarVeiculoMock2 = jest.fn(() => Promise.resolve({data: {err: 'falhou'}}));
        const apiVeiculos = require("../../../features/api/veiculos/veiculoApiSlice")
        apiVeiculos.useEnviarVeiculoMutation.mockReturnValue([enviarVeiculoMock])
        apiVeiculos.useLazyGetVeiculoPelaPlacaQuery.mockReturnValue([buscarVeiculoMock2])
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdicionarVeiculos morador={morador} refetch={refetchMock} />
                </MemoryRouter>
            </Provider>
        )
        const buttonAddElem = screen.getByRole('button', { name: "+" })
    
        //opening the form       
        await user.click(buttonAddElem);

        const placaTextField = screen.getByLabelText('Placa') 
        const buttonBuscarElem = screen.getByRole('button', { name: /buscar/i })
        //typing
        await user.type(placaTextField, 'RPG2R22')
        //clicking buscar button
        await user.click(buttonBuscarElem)

        const modeloTextField = screen.getByLabelText('Modelo')
        const marcaTextField = screen.getByLabelText('Marca')
        const corTextField = screen.getByLabelText('Cor')
        const vagaTextField = screen.getByLabelText('Vaga')
        const autorizacaoTextField = screen.getByLabelText('Tipo de Autorização')
        const statusTextField = screen.getByLabelText('Status de Acesso')
        const buttonAssociarElem = screen.getByRole('button', { name: /Associar ao morador/i })
        const buttonEnviarElem = screen.getByRole('button', { name: /Enviar/i })

        expect(placaTextField.value).toEqual('RPG2R22');
        expect(modeloTextField.value).toEqual('');
        expect(marcaTextField.value).toEqual('');
        expect(corTextField.value).toEqual('');
        expect(vagaTextField.value).toEqual('');
        expect(autorizacaoTextField.value).toEqual('');
        expect(statusTextField.value).toEqual('');
        expect(buttonAssociarElem.disabled).toBe(true);
        expect(buttonEnviarElem.disabled).toBe(false);


    })

    test('should handle enviar veiculo correctly', async () => {
        let buscarVeiculoMock2 = jest.fn(() => Promise.resolve({data: {err: 'falhou'}}));
        const apiVeiculos = require("../../../features/api/veiculos/veiculoApiSlice")
        apiVeiculos.useLazyGetVeiculoPelaPlacaQuery.mockReturnValue([buscarVeiculoMock2])
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdicionarVeiculos morador={morador} refetch={refetchMock} />
                </MemoryRouter>
            </Provider>
        )
        const buttonAddElem = screen.getByRole('button', { name: "+" })
    
        //opening the form       
        await user.click(buttonAddElem);

        const placaTextField = screen.getByLabelText('Placa') 
        const buttonBuscarElem = screen.getByRole('button', { name: /buscar/i })
        //typing
        await user.type(placaTextField, 'RPG2R22')
        //clicking buscar button
        await user.click(buttonBuscarElem)

        const modeloTextField = screen.getByLabelText('Modelo')
        const marcaTextField = screen.getByLabelText('Marca')
        const corTextField = screen.getByLabelText('Cor')
        const vagaTextField = screen.getByLabelText('Vaga')
        const autorizacaoTextField = screen.getByLabelText('Tipo de Autorização')
        const statusTextField = screen.getByLabelText('Status de Acesso')
        const buttonAssociarElem = screen.getByRole('button', { name: /Associar ao morador/i })
        const buttonEnviarElem = screen.getByRole('button', { name: /Enviar/i })

        expect(placaTextField.value).toEqual('RPG2R22');
        expect(modeloTextField.value).toEqual('');
        expect(marcaTextField.value).toEqual('');
        expect(corTextField.value).toEqual('');
        expect(vagaTextField.value).toEqual('');
        expect(autorizacaoTextField.value).toEqual('');
        expect(statusTextField.value).toEqual('');
        expect(buttonAssociarElem.disabled).toBe(true);
        expect(buttonEnviarElem.disabled).toBe(false);

        //typing
       
        await user.type(modeloTextField, 'Civic')
        await user.type(marcaTextField, 'Honda')
        await user.type(corTextField, 'Verde')
        await user.type(vagaTextField, 'parqueamento')
        await user.type(autorizacaoTextField, 'permanente')
        await user.type(statusTextField, 'morador')

        await user.click(buttonEnviarElem);
        expect(enviarVeiculoMock).toHaveBeenCalled();
        expect(enviarVeiculoMock).toHaveBeenCalledWith({veiculo: {
            placa: "RPG2R22",
            modelo: "Civic",
            marca: "Honda",
            cor: "Verde",
            vaga: "parqueamento",
            tipoDeAutorizacao: "permanente",
            status_de_acesso: "morador",
            nomeProprietario: "Ricardo Malfredo Junior",
            apartamento: "1702",
            bloco: "A",
            documentoProprietario: "125.234.566-43",
            observacao: ""
        }});








    })
    test('should handle associar veiculo correctly', async () => {
        let buscarVeiculoMock2 = jest.fn(() => Promise.resolve({data: {err: 'falhou'}}));
        const apiVeiculos = require("../../../features/api/veiculos/veiculoApiSlice")
        apiVeiculos.useLazyGetVeiculoPelaPlacaQuery.mockReturnValue([buscarVeiculoMock2])
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdicionarVeiculos morador={morador} refetch={refetchMock} />
                </MemoryRouter>
            </Provider>
        )
        const buttonAddElem = screen.getByRole('button', { name: "+" })
    
        //opening the form       
        await user.click(buttonAddElem);

        const placaTextField = screen.getByLabelText('Placa') 
        const buttonBuscarElem = screen.getByRole('button', { name: /buscar/i })
        //typing
        await user.type(placaTextField, 'RPG2R22')
        //clicking buscar button
        await user.click(buttonBuscarElem)

        const modeloTextField = screen.getByLabelText('Modelo')
        const marcaTextField = screen.getByLabelText('Marca')
        const corTextField = screen.getByLabelText('Cor')
        const vagaTextField = screen.getByLabelText('Vaga')
        const autorizacaoTextField = screen.getByLabelText('Tipo de Autorização')
        const statusTextField = screen.getByLabelText('Status de Acesso')
        const buttonAssociarElem = screen.getByRole('button', { name: /Associar ao morador/i })
        const buttonEnviarElem = screen.getByRole('button', { name: /Enviar/i })

        expect(placaTextField.value).toEqual('RPG2R22');
        expect(modeloTextField.value).toEqual('');
        expect(marcaTextField.value).toEqual('');
        expect(corTextField.value).toEqual('');
        expect(vagaTextField.value).toEqual('');
        expect(autorizacaoTextField.value).toEqual('');
        expect(statusTextField.value).toEqual('');
        expect(buttonAssociarElem.disabled).toBe(true);
        expect(buttonEnviarElem.disabled).toBe(false);

        //typing
       
        await user.type(modeloTextField, 'Civic')
        await user.type(marcaTextField, 'Honda')
        await user.type(corTextField, 'Verde')
        await user.type(vagaTextField, 'parqueamento')
        await user.type(autorizacaoTextField, 'permanente')
        await user.type(statusTextField, 'morador')

        await user.click(buttonEnviarElem);
        expect(enviarVeiculoMock).toHaveBeenCalled();
        expect(enviarVeiculoMock).toHaveBeenCalledWith({veiculo: {
            placa: "RPG2R22",
            modelo: "Civic",
            marca: "Honda",
            cor: "Verde",
            vaga: "parqueamento",
            tipoDeAutorizacao: "permanente",
            status_de_acesso: "morador",
            nomeProprietario: "Ricardo Malfredo Junior",
            apartamento: "1702",
            bloco: "A",
            documentoProprietario: "125.234.566-43",
            observacao: ""       
        
        }});

       
        
        expect(buttonAssociarElem.disabled).toBe(false);
        await user.click(buttonAssociarElem)
        expect(atualizarMoradorMock).toHaveBeenCalled();
    })

})