package com.example.backend.Repository;

import com.example.backend.Model.WorkoutPlan;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutPlanRepository extends MongoRepository<WorkoutPlan, String> {

    List<WorkoutPlan> findByCreatorId(String userId);
}
