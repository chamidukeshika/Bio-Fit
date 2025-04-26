package com.example.backend.Model;

import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection="Status")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Status {

    @Id
    private String id;

    private String user;
    private String description;
    private double distanceRan;
    private int pushups;
    private double benchPress;
    private List<String> comments;

    private String imageUrl;
    private LocalDateTime createdAt;

    


    
}
