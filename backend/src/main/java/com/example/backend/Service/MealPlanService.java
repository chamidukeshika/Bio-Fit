package com.example.backend.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Model.Comment;
import com.example.backend.Model.Likes;
import com.example.backend.Model.MealPlan;
import com.example.backend.Model.WorkoutPlan;
import com.example.backend.Repository.MealPlanRepository;

@Service
public class MealPlanService {
    @Autowired
    private MealPlanRepository mealPlanRepository;

    public List<MealPlan> allMealPlans() {
        return mealPlanRepository.findAll();
    }

    public Optional<MealPlan> singleMealPlan(String id) {
        return mealPlanRepository.findById(id);
    }

    public MealPlan creatMealPlan(MealPlan mealPlan) {
        return mealPlanRepository.save(mealPlan);

    }

    public List<MealPlan> getMealPlansByUserId(String userId) {
        return mealPlanRepository.findByUserId(userId);
    }

    public void deleteMealPlanById(String mealPlanId) {
        mealPlanRepository.deleteById(mealPlanId);
    }

    public MealPlan updateMealPlanById(String mealPlanId, MealPlan updatedMealPlan) {
        MealPlan existingMealPlan = mealPlanRepository.findById(mealPlanId)
                .orElseThrow(() -> new RuntimeException("Meal plan not found"));

        String prevImage = existingMealPlan.getMealsPicURL();

        // Update existing workout plan fields with the updated values
        existingMealPlan.setUserId(updatedMealPlan.getUserId());
        existingMealPlan.setTitle(updatedMealPlan.getTitle());
        existingMealPlan.setCategory(updatedMealPlan.getCategory());
        existingMealPlan.setMeals(updatedMealPlan.getMeals());

        if (updatedMealPlan.getMealsPicURL() == null) {
            existingMealPlan.setMealsPicURL(prevImage);
        } else {
            existingMealPlan.setMealsPicURL(updatedMealPlan.getMealsPicURL());
        }

        // Save the updated meal plan
        return mealPlanRepository.save(existingMealPlan);
    }

    public MealPlan addCommentToMealPlan(String mealPlanId, Comment comment) {
        MealPlan existingMealPlan = mealPlanRepository.findById(mealPlanId)
                .orElseThrow(() -> new RuntimeException("Mealplan not found"));

        existingMealPlan.getComments().add(comment);

        return mealPlanRepository.save(existingMealPlan);
    }

    public MealPlan like(String mealPlanId, Likes like) {
        MealPlan existingMealPlan = mealPlanRepository.findById(mealPlanId)
                .orElseThrow(() -> new RuntimeException("Mealplan not found"));

        existingMealPlan.getLikes().add(like);

        return mealPlanRepository.save(existingMealPlan);
    }

    public MealPlan unlike(String mealPlanId, Likes unlike) {
        MealPlan existingMealPlan = mealPlanRepository.findById(mealPlanId)
                .orElseThrow(() -> new RuntimeException("Mealplan not found"));

        existingMealPlan.getLikes().remove(unlike);

        return mealPlanRepository.save(existingMealPlan);
    }

}
