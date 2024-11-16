package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.List;

@Controller
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, RoleService roleService) {
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
        this.userService = userService;
    }

    @GetMapping({ "/admin"})
    public String showAllUsersFromAdmin(Model model, HttpServletRequest request) {
        model.addAttribute("users", userService.findAllUsers());
        model.addAttribute("currentPath", request.getRequestURI());
        model.addAttribute("allRoles", roleService.findAll());
        return "user";
    }

    @GetMapping({ "/user"})
    public String showAllUsersFromUser(Model model, Principal principal, HttpServletRequest request) {
        String username = principal.getName();
        model.addAttribute("users", userService.findByUsername(username));
        model.addAttribute("currentPath", request.getRequestURI());
        return "user";
    }

    @GetMapping("/admin/users/new")
    public ModelAndView newUser() {
        User user = new User();
        ModelAndView mav = new ModelAndView();
        mav.addObject("user", user);
        mav.addObject("allRoles", roleService.findAll());
        return mav;
    }

    @RequestMapping(value = "/admin/users/save", method = RequestMethod.POST)
    public String saveUser(@ModelAttribute("user") User user) {
        User newUser = new User();
        String pwd = passwordEncoder.encode(user.getPassword());
        newUser.setUsername(user.getUsername());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(pwd);
        newUser.setRoles(user.getRoles());
        userService.saveUser(newUser);
        return "redirect:/admin";
    }


    @GetMapping("/admin/users/edit/{username}")
    public ModelAndView editUser(@PathVariable(name = "username") String username) {
        User user = userService.findByUsername(username);
        ModelAndView mav = new ModelAndView();
        mav.addObject("user", user);
        mav.addObject("allRoles", roleService.findAll());
        List<Role> userRoles = (List<Role>) user.getRoles();
        mav.addObject("userRoles", userRoles);
        return mav;
    }

    @RequestMapping(value = "/admin/users/update/{username}", method = RequestMethod.POST)
    public String updateUser(@PathVariable String username, @ModelAttribute("user") User user) {
        User user1 = userService.findByUsername(user.getUsername());
        user1.setUsername(username);
        user1.setId(userService.findByUsername(username).getId());
        user1.setRoles(user.getRoles());
        user1.setFirstName(user.getFirstName());
        user1.setLastName(user.getLastName());
        user1.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.updateUser(user1);
        return "redirect:/admin";
    }

    @RequestMapping(value = "/admin/users/delete/{username}")
    public String removeUser(@PathVariable String username) {
        userService.deleteByUsername(username);
        return "redirect:/admin";
    }
}

