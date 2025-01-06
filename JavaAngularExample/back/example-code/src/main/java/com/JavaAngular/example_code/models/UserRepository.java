package com.JavaAngular.example_code.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Find by name
    List<User> findByName(String name);

    // Find by ID (Already provided by JPA Repository)
}
