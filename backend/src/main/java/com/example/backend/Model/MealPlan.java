package com.example.backend.Model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "meal_plans")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class MealPlan {   
    @Id
    private String id;

    // ID of the user who created the meal plan
    private String userId;

    private String title;

    private String category;

    private List<Meal> meals;

    private String mealsPicURL;

    private List<Comment> comments = new ArrayList<>();

    private List<Likes> likes = new ArrayList<>();

    public MealPlan(String userId, String title, String category, List<Meal> meals, String mealsPicURL) {
        this.userId = userId;
        this.title = title;
        this.category = category;
        this.meals = meals;
        this.mealsPicURL = mealsPicURL;
    }

}
