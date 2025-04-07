package com.condominio;


import java.util.Locale;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
@ComponentScan(basePackages = "com.condominio")

public class MoradaDoSolApplication {
	public static String  whereItIs = ""; 
	public static void main(String[] args) {
		Locale.setDefault(new Locale("pt", "BR"));
		SpringApplication.run(MoradaDoSolApplication.class, args);
	}

}
