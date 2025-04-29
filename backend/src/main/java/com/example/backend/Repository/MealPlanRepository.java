package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Model.MealPlan;

@Repository
public interface MealPlanRepository extends MongoRepository<MealPlan, String> {

    List<MealPlan> findByUserId(String userId);

    // MealPlan findMealByName(String name);
}
