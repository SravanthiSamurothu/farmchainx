package com.farmchainx.config;

import com.farmchainx.model.User;
import com.farmchainx.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (repo.count() == 0) {
                String hashed = encoder.encode("demo1234");
                String[][] users = {
                    {"Ravi Kumar",    "farmer@demo.com",      "FARMER"},
                    {"Priya Sharma",  "distributor@demo.com", "DISTRIBUTOR"},
                    {"Amit Patel",    "retailer@demo.com",    "RETAILER"},
                    {"Meera Nair",    "consumer@demo.com",    "CONSUMER"},
                };
                for (String[] u : users) {
                    User user = new User();
                    user.setName(u[0]);
                    user.setEmail(u[1]);
                    user.setPassword(hashed);
                    user.setRole(User.Role.valueOf(u[2]));
                    repo.save(user);
                }
                System.out.println("✅ Demo users seeded!");
            } else {
                System.out.println("✅ Database already seeded, skipping.");
            }
        };
    }
}