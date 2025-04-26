package com.example.backend.Model;

import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Meal {
    @Id
    private String id;

    private String name;

    private List<String> ingredients;

    private String instructions;

    private String size;

    private List<String> nutritious;

}
