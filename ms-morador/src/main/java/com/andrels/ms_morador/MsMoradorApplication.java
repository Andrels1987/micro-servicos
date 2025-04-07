package com.andrels.ms_morador;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsMoradorApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsMoradorApplication.class, args);
	}

}
