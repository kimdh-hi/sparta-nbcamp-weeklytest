package com.example.test09;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class Test09Application {

    public static void main(String[] args) {
        SpringApplication.run(Test09Application.class, args);
    }

}
