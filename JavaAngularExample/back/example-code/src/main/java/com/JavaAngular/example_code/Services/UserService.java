package com.JavaAngular.example_code.Services;

import com.JavaAngular.example_code.models.User;
import com.JavaAngular.example_code.models.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Get All Users
    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }

    // Find by Id
    public Optional<User> getUserById(Long id) {
        return this.userRepository.findById(id);
    }

    // Find user by name
    public List<User> getUsersByName(String name) {
        return this.userRepository.findByName(name);
    }

    public void addUser(User user) {
        this.userRepository.save(user);
    }

    public boolean deleteUser(Long id) {
        try {
            this.userRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
