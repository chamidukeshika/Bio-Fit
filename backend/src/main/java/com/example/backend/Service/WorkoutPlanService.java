package com.example.backend.Service;

import com.example.backend.Dto.EditCommentDto;
import com.example.backend.Model.WorkoutPlan;
import com.example.backend.Model.Comment;
import com.example.backend.Model.Likes;
import com.example.backend.Repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class WorkoutPlanService {
    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    public WorkoutPlan createWorkoutPlan(WorkoutPlan workoutPlan) {

        workoutPlan.setCreationDate(new Date());
        workoutPlan.setLastModifiedDate(new Date());
        return workoutPlanRepository.save(workoutPlan);

    }


    public List<WorkoutPlan> getWorkoutPlansByUserId(String userId) {

        return workoutPlanRepository.findByCreatorId(userId);

    }

    public List<WorkoutPlan> getAllWorkoutPlans() {
        
        List<WorkoutPlan> allPlans = workoutPlanRepository.findAll();
        return allPlans.stream()
                .filter(WorkoutPlan::isVisibility)
                .collect(Collectors.toList());

    }

    public Optional<WorkoutPlan> getWorkoutPostById(String postID) {
        
        return workoutPlanRepository.findById(postID);

    }

    public void deleteWorkoutPlanById(String workoutPlanId) {

        workoutPlanRepository.deleteById(workoutPlanId);

    }

    public WorkoutPlan updateWorkoutPlanById(String workoutPlanId, WorkoutPlan updatedWorkoutPlan) {

        WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));

        String prevImage = existingWorkoutPlan.getImage();

        // Update existing workout plan fields with the updated values
        existingWorkoutPlan.setName(updatedWorkoutPlan.getName());
        existingWorkoutPlan.setDescription(updatedWorkoutPlan.getDescription());
        existingWorkoutPlan.setExercises(updatedWorkoutPlan.getExercises());
        existingWorkoutPlan.setDuration(updatedWorkoutPlan.getDuration());
        existingWorkoutPlan.setIntensity(updatedWorkoutPlan.getIntensity());

        if (updatedWorkoutPlan.getImage() == null) {
            existingWorkoutPlan.setImage(prevImage);
        } else {
            existingWorkoutPlan.setImage(updatedWorkoutPlan.getImage());
        }

        if (updatedWorkoutPlan.getVideo() == null) {
            existingWorkoutPlan.setVideo(existingWorkoutPlan.getVideo());
        } else {
            existingWorkoutPlan.setVideo(updatedWorkoutPlan.getVideo());
        }
        existingWorkoutPlan.setLastModifiedDate(new Date());
        existingWorkoutPlan.setVisibility(updatedWorkoutPlan.isVisibility());

        // Save the updated workout plan
        return workoutPlanRepository.save(existingWorkoutPlan);

    }
    
    
    public WorkoutPlan UpdateVisibility(String workoutPlanId, boolean visibility) {
        
        WorkoutPlan existingWorkoutPlan = workoutPlanRepository.findById(workoutPlanId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));


        existingWorkoutPlan.setVisibility(visibility);
        existingWorkoutPlan.setLastModifiedDate(new Date());

        return workoutPlanRepository.save(existingWorkoutPlan);
        
    }

}
