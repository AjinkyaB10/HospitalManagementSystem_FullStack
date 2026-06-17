package com.hospital.config;

import com.hospital.model.Role;
import com.hospital.model.User;
import com.hospital.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner createAdmin(UserService userService) {
        return args -> {
            if (!userService.existsByEmail("admin@gmail.com")) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword("admin123");
                admin.setRole(Role.ADMIN);
                userService.saveUser(admin);
            }
        };
    }
}
