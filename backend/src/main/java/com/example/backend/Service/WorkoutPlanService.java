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

    public List<WorkoutPlan> getAllWorkoutPlans(){
        List<WorkoutPlan> allPlans = workoutPlanRepository.findAll();
        return allPlans.stream()
                .filter(WorkoutPlan::isVisibility)
                .collect(Collectors.toList());
    }

    public Optional<WorkoutPlan> getWorkoutPostById(String postID){
        return workoutPlanRepository.findById(postID);
    }

   

}
