package com.example.backend.Repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;


import com.example.backend.Model.Status;

@Repository
public interface StatusRepository extends MongoRepository< Status , String> {

    List<Status> findByUser(String user); // New method to find all statuses by user


    // @Query(value = "{ 'createdAt' : { $lt : ?0 } }")
    // void deleteOldStatuses(LocalDateTime dateTime);

        List<Status> findByCreatedAtBefore(LocalDateTime timestamp);
  
}
