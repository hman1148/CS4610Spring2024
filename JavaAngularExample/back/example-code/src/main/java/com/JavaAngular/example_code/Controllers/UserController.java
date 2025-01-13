package com.JavaAngular.example_code.Controllers;

import com.JavaAngular.example_code.Services.UserService;
import com.JavaAngular.example_code.models.GenericResponse;
import com.JavaAngular.example_code.models.RequestModels.UserRequestModel;
import com.JavaAngular.example_code.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
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


    @PutMapping("/users/{id}")
    public ResponseEntity<GenericResponse<User>>
    updateUser(@PathVariable Long id, @RequestBody UserRequestModel updatedUser) {
        if (updatedUser.userHasNullProperties()) {
            GenericResponse<User> nullResponse = new GenericResponse<>(null,
                    "Request has null properties", false);
            return ResponseEntity.badRequest().body(nullResponse);
         }

        try {
            Optional<User> result = this.userService.updateUser(id, updatedUser);

            if (result.isPresent()) {
                GenericResponse<User> successResponse = new GenericResponse<>(
                        result.get(), "User updated successfully", true);
                return ResponseEntity.ok(successResponse);
            } else {
                GenericResponse<User> failedResponse = new GenericResponse<>(
                        null, "User not found with ID: " + id, false);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(failedResponse);
            }
        } catch (Exception e) {
            GenericResponse<User> exceptionResponse = new GenericResponse<>(
                    null, "User Service failed to update", false
            );
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(exceptionResponse);
        }
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
