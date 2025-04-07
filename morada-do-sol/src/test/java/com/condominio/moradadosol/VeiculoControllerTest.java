package com.condominio.moradadosol;

import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.data.domain.Sort;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.condominio.controlers.VeiculoController;
import com.condominio.models.Veiculo;
import com.condominio.repositorios.RepositorioDeVeiculos;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VeiculoController.class)
public class VeiculoControllerTest {
    
    @Autowired
    private MockMvc mockMvc;

    @Mock // This ensures Spring injects the mock into the controller
    private RepositorioDeVeiculos repositorioDeVeiculos;

    @InjectMocks
    private VeiculoController veiculoController; 

    private List<Veiculo> listOfVeiculos = List.of(
        new Veiculo("Civic", "Branco", "", "HRV7B89", "S 2", "HONDA"),
        new Veiculo("Uno", "Vermelho", "", "LTM4623", "S 1", "FIAT")
    );
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(veiculoController).build();    
        
    }

    @Test
    public void testGetAllVeiculos() throws Exception {
        

        when(repositorioDeVeiculos.findAll(Mockito.any(Sort.class)))  // Mocking the sorted method
        .thenReturn(listOfVeiculos);

        mockMvc.perform(get("/api/veiculos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$.[0].placa").value("HRV7B89"));
    }

    @Test
    public void testGetVeiculoPelaPlaca() throws Exception{
        when(repositorioDeVeiculos.getVeiculoPelaPlaca("HRV7B89")).thenReturn(listOfVeiculos.get(0));

        mockMvc.perform(get("/api/veiculo/placa/HRV7B89"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.modelo").value("Civic"));
    }
}
