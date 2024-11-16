package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class MyRestController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    public MyRestController(UserService userService, PasswordEncoder passwordEncoder, RoleService roleService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }

    @GetMapping
    public List<User> showAllUsers() {
        return userService.findAllUsers();
    }
    @GetMapping("/{id}")
    public User showUser(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    public ResponseEntity<HttpStatus> createUser(@RequestBody @Valid User user) {
        user.setUsername(user.getUsername());
        user.setFirstName(user.getFirstName());
        user.setLastName(user.getLastName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(user);
        return ResponseEntity.ok(HttpStatus.CREATED);
    }
    @PostMapping("/{id}")
    public ResponseEntity<HttpStatus> updateUser(@PathVariable Long id, @RequestBody @Valid User user) {
        user.setId(userService.findById(id).getId());
        user.setFirstName(user.getFirstName());
        user.setLastName(user.getLastName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.updateUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }
    @PostMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }
    @GetMapping("/roles")
    public List<Role> showAllRoles() {
        return roleService.findAll();
    }
}
