import BtnAdicionar from "../BtnAdicionar";
import '@testing-library/jest-dom'
import "@testing-library/react"
import { render, screen } from "@testing-library/react";
import React from "react";



describe("Btn Adicionar", () =>{



    test('should render correcty', () => { 

        render(
            <BtnAdicionar link={"any link"}/>
        )

        const linkElem = screen.getByText("+");
        expect(linkElem).toBeInTheDocument();
     })
})