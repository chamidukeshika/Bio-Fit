package com.example.backend.Model;

import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "WorkoutPlans")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class WorkoutPlan {
    @Id
    private String id;
    private String name;
    private String description;
    private List<Exercise> exercises;
    private String duration;
    private String intensity;
    private String creatorId; // Assuming the creator is identified by user ID
    private String creatorName;
    private String image;
    private String video;
    private List<Comment> comments = new ArrayList<>();
    private List<Likes> likes=  new ArrayList<>();
    private Date creationDate;
    private Date lastModifiedDate;
    private boolean visibility = true;


    public WorkoutPlan(String name, String description, List<Exercise> exercises,String duration,String intensity, String creatorId, Boolean visibility){
        this.name = name;
        this.description = description;
        this.exercises = exercises;
        this.duration =  duration;
        this.intensity = intensity;
        this.creatorId = creatorId;
        this.creationDate = new Date();
        this.lastModifiedDate = new Date();
        this.visibility = visibility;
    }

}
