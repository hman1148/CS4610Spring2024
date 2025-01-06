package com.JavaAngular.example_code.Controllers;

import com.JavaAngular.example_code.Services.UserService;
import com.JavaAngular.example_code.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return this.userService.getAllUsers();
    }

    // Find by id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = this.userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Find users by name
    @GetMapping("/search")
    public List<User> getUsersByName(@RequestParam String name) {
        return this.userService.getUsersByName(name);
    }
}
