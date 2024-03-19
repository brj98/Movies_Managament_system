package com.movies.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;


@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})

public class MoviesBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoviesBackendApplication.class, args);
	}

}
