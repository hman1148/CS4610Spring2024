package com.JavaAngular.example_code.Controllers;

import com.JavaAngular.example_code.Services.UserService;
import com.JavaAngular.example_code.models.GenericResponse;
import com.JavaAngular.example_code.models.RequestModels.UserRequestModel;
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
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return this.userService.getAllUsers();
    }

    // Find by id
    @GetMapping("/users/{id}")
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

    @PostMapping("/users")
    public ResponseEntity<GenericResponse<User>> addUser(@RequestBody UserRequestModel request) {
        if (request.userHasNullProperties()) {
            User user = null;
            GenericResponse<User> errorResponse = new GenericResponse<User>(null,
                    "Failed to Add User to database", false);
            return ResponseEntity.badRequest().body(errorResponse);
        }

        User addedUser = new User(request.getName(), request.getEmail(), request.getAge());
        this.userService.addUser(addedUser);

        GenericResponse<User> successResponse = new GenericResponse<>(addedUser,
                "Successfully Added User " + addedUser.getName(), true);

        return ResponseEntity.ok(successResponse);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<GenericResponse<String>> deleteUser(@PathVariable Long id) {
        if (id == null) {
            GenericResponse<String> errorResponse = new GenericResponse<>("",
                    "User Id doesn't exist", false);
            return ResponseEntity.badRequest().body(errorResponse);
         }

        if (this.userService.deleteUser(id)) {
            GenericResponse<String> successResponse = new GenericResponse<>("Success", "Successfully deleted User", true);
            return ResponseEntity.ok(successResponse);
        } else {
            GenericResponse<String> errorResponse = new GenericResponse<>("Failed", "Failed to delete user", false);
            return ResponseEntity.ok(errorResponse);
        }
    }
}
