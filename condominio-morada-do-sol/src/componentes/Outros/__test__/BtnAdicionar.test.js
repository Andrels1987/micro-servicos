import BtnAdicionar from "../BtnAdicionar";
import '@testing-library/jest-dom'
import "@testing-library/react"
import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider} from 'react-redux'
import { MemoryRouter } from "react-router-dom";



describe("Btn Adicionar", () => {

    //const store = 


    test('should render correcty', () => {

        render(
           //<Provider store={null}>
                <MemoryRouter>
                    <BtnAdicionar link={"./anylink"} />
                </MemoryRouter>
            //</Provider>
        )

        const linkElem = screen.getByText("+");
        expect(linkElem).toBeInTheDocument();
        expect(linkElem.href.includes("anylink")).toBe(true);
    })
})