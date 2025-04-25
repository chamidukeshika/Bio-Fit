package com.example.backend.Controller;

import com.example.backend.Dto.EditCommentDto;
import com.example.backend.Model.Likes;
import com.example.backend.Model.WorkoutPlan;
import com.example.backend.Model.Comment;
import com.example.backend.Service.WorkoutPlanService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/workoutPlans")
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanService workoutPlanService;

    @PostMapping
    public ResponseEntity<?> createWorkoutPlan(@RequestBody WorkoutPlan workoutPlan) {

        WorkoutPlan createdWorkoutPlan = workoutPlanService.createWorkoutPlan(workoutPlan);

        // Create HATEOAS response with self link
        EntityModel<WorkoutPlan> resource = EntityModel.of(createdWorkoutPlan);
        resource.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).createWorkoutPlan(workoutPlan)).withSelfRel());

        // Return the response with created status and HATEOAS links
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getWorkoutPlansByUserId(@PathVariable("userId") String userId) {
        List<WorkoutPlan> workoutPlans = workoutPlanService.getWorkoutPlansByUserId(userId);

        // If no workout plans found, return 404 NOT FOUND
        if (workoutPlans.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No workout plans found for the user");
        }

        // Create a collection model
        CollectionModel<WorkoutPlan> resource = CollectionModel.of(workoutPlans);

        // Add self link for each workout plan
        for (WorkoutPlan workoutPlan : workoutPlans) {
            Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).getWorkoutPlansByUserId(userId)).withSelfRel();
            resource.add(selfLink.withRel("workoutPlan-" + workoutPlan.getId()));
        }

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);
    }

    @GetMapping("/allWorkoutPlans")
    public ResponseEntity<?> getAllWorkoutPlans( ) {
        List<WorkoutPlan> workoutPlans = workoutPlanService.getAllWorkoutPlans();

        // If no workout plans found, return 404 NOT FOUND
        if (workoutPlans.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No workout plans found");
        }

        // Create a collection model
        CollectionModel<WorkoutPlan> resource = CollectionModel.of(workoutPlans);

        // Add self link for each workout plan
        for (WorkoutPlan workoutPlan : workoutPlans) {
            Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).getAllWorkoutPlans()).withSelfRel();
            resource.add(selfLink.withRel("workoutPlan-" + workoutPlan.getId()));
        }

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);
    }


    @GetMapping("viewPost/{postId}")
    public ResponseEntity<?> getWorkoutPlanById(@PathVariable("postId") String postId) {
        Optional<WorkoutPlan> workoutPlan = workoutPlanService.getWorkoutPostById(postId);

        if (workoutPlan.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workout plan not found");
        }

        
        EntityModel<Optional<WorkoutPlan>> resource = EntityModel.of(workoutPlan);

       
        Link selfLink = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(WorkoutPlanController.class).getWorkoutPlanById(postId)).withSelfRel();
        resource.add(selfLink);

      
        return ResponseEntity.ok(resource);

    }




}
