package com.example.backend.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Model.Comment;
import com.example.backend.Model.Likes;
import com.example.backend.Model.MealPlan;
import com.example.backend.Model.WorkoutPlan;
import com.example.backend.Service.MealPlanService;

@RestController
@RequestMapping("/api/user/mealplan")
public class MealPlanController {
    @Autowired
    private MealPlanService mealPlanService;

    @GetMapping
    public ResponseEntity<List<MealPlan>> getallMealPlan() {
        return new ResponseEntity<List<MealPlan>>(mealPlanService.allMealPlans(), HttpStatus.OK);
    }

    @GetMapping("/{mealplanId}")
    public ResponseEntity<?> getSingleMealPlan(@PathVariable("mealplanId") String id) {

        Optional<MealPlan> mealPlan = mealPlanService.singleMealPlan(id);

        if (mealPlan == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("MealPlan is Not available");
        }

        // Create HATEOAS response with self link
        EntityModel<Optional<MealPlan>> resource = EntityModel.of(mealPlan);
        resource.add(WebMvcLinkBuilder
                .linkTo(WebMvcLinkBuilder.methodOn(MealPlanController.class).getSingleMealPlan(id)).withSelfRel());

        // Return the response with created status and HATEOAS links
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);

    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getMealPlansByUserId(@PathVariable("userId") String userId) {
        List<MealPlan> mealPlans = mealPlanService.getMealPlansByUserId(userId);

        if (mealPlans.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No meal plans found for the user");
        }

        // Create a collection model
        CollectionModel<MealPlan> resource = CollectionModel.of(mealPlans);

        // Add self link for each workout plan
        for (MealPlan mealPlan : mealPlans) {
            Link selfLink = WebMvcLinkBuilder
                    .linkTo(WebMvcLinkBuilder.methodOn(MealPlanController.class).getMealPlansByUserId(userId))
                    .withSelfRel();
            resource.add(selfLink.withRel("mealPlan-" + mealPlan.getId()));
        }

        // Return response with HATEOAS links
        return ResponseEntity.ok(resource);
    }

    @PostMapping
    public ResponseEntity<?> creatMealPlane(@RequestBody MealPlan mealPlan) {

        // Create the MealPlan
        MealPlan createdMealPlan = mealPlanService.creatMealPlan(mealPlan);

        // Create HATEOAS response with self link
        EntityModel<MealPlan> resource = EntityModel.of(createdMealPlan);
        resource.add(WebMvcLinkBuilder
                .linkTo(WebMvcLinkBuilder.methodOn(MealPlanController.class).creatMealPlane(mealPlan)).withSelfRel());

        // Return the response with created status and HATEOAS links
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);

    }

    @DeleteMapping("/{mealPlanId}")
    public ResponseEntity<String> deleteMealPlanById(@PathVariable("mealPlanId") String mealPlanId) {
        mealPlanService.deleteMealPlanById(mealPlanId);
        return new ResponseEntity<>("Meal plan deleted successfully", HttpStatus.OK);
    }

    @PutMapping("/{mealPlanId}")
    public ResponseEntity<EntityModel<MealPlan>> updateMealPlanById(@PathVariable("mealPlanId") String mealPlanId,
            @RequestBody MealPlan updatedMealPlan) {
        MealPlan updatedPlan = mealPlanService.updateMealPlanById(mealPlanId, updatedMealPlan);

        // Create self link
        Link selfLink = WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(MealPlanController.class).updateMealPlanById(mealPlanId, updatedMealPlan))
                .withSelfRel();

        // Create response entity with self link
        EntityModel<MealPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/comments/{mealPlanId}")
    public ResponseEntity<?> addCommentToMealPlan(@PathVariable String mealPlanId, @RequestBody Comment comment) {
        MealPlan updatedPlan = mealPlanService.addCommentToMealPlan(mealPlanId, comment);

        // Create self link
        Link selfLink = WebMvcLinkBuilder
                .linkTo(WebMvcLinkBuilder.methodOn(MealPlanController.class).addCommentToMealPlan(mealPlanId, comment))
                .withSelfRel();

        // Create response entity with self link
        EntityModel<MealPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/like/{mealPlanId}")
    public ResponseEntity<?> Like(@PathVariable String mealPlanId, @RequestBody Likes like) {
        MealPlan updatedPlan = mealPlanService.like(mealPlanId, like);
        System.out.println(like);

        // Create self link
        Link selfLink = WebMvcLinkBuilder
                .linkTo(WebMvcLinkBuilder.methodOn(MealPlanController.class).Like(mealPlanId, like)).withSelfRel();

        // Create response entity with self link
        EntityModel<MealPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/unlike/{mealPlanId}")
    public ResponseEntity<?> Unlike(@PathVariable String mealPlanId, @RequestBody Likes unlike) {
        MealPlan updatedPlan = mealPlanService.unlike(mealPlanId, unlike);

        // Create self link
        Link selfLink = WebMvcLinkBuilder
                .linkTo(WebMvcLinkBuilder.methodOn(MealPlanController.class).Unlike(mealPlanId, unlike)).withSelfRel();

        // Create response entity with self link
        EntityModel<MealPlan> response = EntityModel.of(updatedPlan);
        response.add(selfLink);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
