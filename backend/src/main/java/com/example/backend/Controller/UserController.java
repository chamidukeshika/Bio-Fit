package com.example.backend.Controller;

import com.example.backend.Dto.FollowDto;
import com.example.backend.Dto.GoogleSignUpDto;
import com.example.backend.Dto.LoginDto;
import com.example.backend.Dto.profileUpdateDto;
import com.example.backend.Model.User;
import com.example.backend.Service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.support.NullValue;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Check if username or email already exists
        if (userService.findByUsername(user.getUserName()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        // Register the user
        User registeredUser = userService.register(user);

        // Create HATEOAS response with self link
        EntityModel<User> resource = EntityModel.of(registeredUser);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).registerUser(user)).withSelfRel());

        // Return the response with created status and HATEOAS links
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }

    @PostMapping("/googleSignUp")
    public ResponseEntity<?> registerUserByGoogle(@RequestBody GoogleSignUpDto gUser) {
        // Check if username or email already exists
        System.out.print(gUser.getEmail());
        User userR = userService.findByEmail(gUser.getEmail());
        System.out.print(userR);
        if (userService.findByEmail(gUser.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(userR);
        }
        User newUser = new User();
        newUser.setUserName(gUser.getUserName());
        newUser.setEmail(gUser.getEmail());
        newUser.setProfilePicURL(gUser.getProfileImageUrl());
        newUser.setFirstName(gUser.getName());
        newUser.setUserType("User");

        // Register the user
        User registeredUser = userService.register(newUser);

        // Create HATEOAS response with self link
        EntityModel<User> resource = EntityModel.of(registeredUser);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).registerUser(newUser)).withSelfRel());

        // Return the response with created status and HATEOAS links
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }



    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody LoginDto loginDto){
        User user = userService.findByEmail(loginDto.getEmail());

        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        else{
            if(Objects.equals(loginDto.getPassword(), user.getPassword())){
                EntityModel<User> resource = EntityModel.of(user);
                resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).getUserByEmail(loginDto.getEmail())).withSelfRel());

                // Return response with HATEOAS links
                return ResponseEntity.ok(resource);
            }
            else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password Incorrect");
            }

        }
    }

    @GetMapping("/allUsers")
    public ResponseEntity<?> getAllUsers() {
        List<User> user = userService.findAllUsers();

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Users not found");
        }

        // Add self link
        //CollectionModel<User> resource = CollectionModel.of(user);
        //resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).getAllUsers()).withSelfRel());

        // Return response with HATEOAS links
        return ResponseEntity.ok(user);
    }

    @GetMapping("/getUserByEmail/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Add self link
        EntityModel<User> resource = EntityModel.of(user);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).getUserByEmail(email)).withSelfRel());

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);
    }

    @GetMapping("/getUserById/{Id}")
    public ResponseEntity<?> getUserById(@PathVariable ObjectId Id) {
        Optional<User> user = userService.findById(Id);

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Add self link
        EntityModel<Optional<User>> resource = EntityModel.of(user);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).getUserById(Id)).withSelfRel());

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);
    }

    @PostMapping("/follow")
    public String followUser(@RequestBody FollowDto followDto){
        return userService.followUser(followDto.getUser1(), followDto.getUser2());
    }

    @GetMapping("/myFollowers/{userId}")
    public List<Optional<User>> myFollowers(@PathVariable String userId){
        return userService.getFollowers(userId);
    }

    @PostMapping("/unfollow")
    public String unFollowUser(@RequestBody FollowDto followDto){
        return userService.unFollowUser(followDto.getUser1(), followDto.getUser2());
    }

    @PutMapping("/{userId}")
    public String updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
        // Set the ID of the updated user object to match the path variable
        updatedUser.setId(userId);
        userService.updateUser(updatedUser);
        return "User updated";
    }

    @PutMapping("/updateProfilePic/{userId}")
    public String updateProfilePic(@PathVariable String userId, @RequestBody profileUpdateDto profilePicUrl){
        Optional<User> user = userService.findById(userId);
        User updatedUser = new User();

        if(user.isPresent()){

            user.get().setProfilePicURL(profilePicUrl.getProfilePicLink());
            updatedUser = user.get();
            userService.updateUser(updatedUser);
        }
        return "profile pic updated";
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable String userId) {
        userService.deleteUserById(userId);
        return "User Deleted";
    }

    @PostMapping("/getUsersNames")
    public ResponseEntity<?> getUsernames(@RequestBody List<String> ids){
        List<String> namesArray = new ArrayList<>();
        for (String id: ids
             ) {

            Optional<User> u = userService.findById(id);

            u.ifPresent(user -> namesArray.add(user.getFirstName()));

        }
        System.out.print(namesArray);
        return ResponseEntity.ok(namesArray);
    }

}
