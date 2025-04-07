package com.andrels.ms_servicos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsServicosApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsServicosApplication.class, args);
	}

}
