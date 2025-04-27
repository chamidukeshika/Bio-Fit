package com.example.backend.Controller;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
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

import com.example.backend.Model.Status;
import com.example.backend.Service.StatusService;

@RestController
@RequestMapping("/api/user/StatusTest")
public class StatusController {

    @Autowired
    private StatusService statusService;

    @GetMapping
    public ResponseEntity<List<Status>> allStatuses() {
        return new ResponseEntity<List<Status>>(statusService.allStatuses(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Status>> singleStatus(@PathVariable String id) {
        return new ResponseEntity<Optional<Status>>(statusService.singleStatus(id), HttpStatus.OK);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<Optional<Status>> deleteStatus(@PathVariable ObjectId id) {
    //     return new ResponseEntity<Optional<Status>>(statusService.singleStatus(id), HttpStatus.OK);
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatus(@PathVariable String id) {
        statusService.deleteStatus(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<?> createStatus(@RequestBody Status status) {

        // Create the Status
        Status createStatus = statusService.createStatus(status);

        // Create HATEOAS response with self link
        EntityModel<Status> resource = EntityModel.of(createStatus);
        resource.add(WebMvcLinkBuilder
                .linkTo(WebMvcLinkBuilder.methodOn(StatusController.class).createStatus(status)).withSelfRel());

        // Return the response with created status and HATEOAS links
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);

       
    }

    // @PutMapping("/{id}")
    // public String updateStatus(@PathVariable ObjectId id, @RequestBody Status status) {
    //     // Set the ID of the updated user object to match the path variable
    //     updateStatus(id, status);
    //     statusService.updateStatus(status);;
    //     return "User updated";
    // }

    @PutMapping("/{id}")
    public ResponseEntity<Status> updateStatus(@PathVariable("id") String id, @RequestBody Status updateStatus) {

        updateStatus.setId(id);

        

        return ResponseEntity.ok(statusService.updateStatus(updateStatus));
    }



    

      // New endpoint to get all statuses by user
      @GetMapping("/user/{user}")
      public ResponseEntity<List<Status>> getAllStatusesByUser(@PathVariable String user) {
          return new ResponseEntity<List<Status>>(statusService.getAllStatusesByUser(user), HttpStatus.OK);
      }

}

