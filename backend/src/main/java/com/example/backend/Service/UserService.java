package com.example.backend.Service;

import com.example.backend.Model.User;
import com.example.backend.Repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUserName(username);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findById(String Id) {
        return userRepository.findById(Id);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(ObjectId Id) {
        return userRepository.findById(String.valueOf(Id));
    }

    public void updateUser(User updatedUser) {
        userRepository.save(updatedUser);
    }

    public void deleteUserById(String userId) {
        userRepository.deleteById(userId);
    }

}
