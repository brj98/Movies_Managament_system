package com.movies.backend.controller;

import com.movies.backend.model.Cast;
import com.movies.backend.model.Content;
import com.movies.backend.model.Metadata;
import com.movies.backend.model.MovieDataRequest;
import com.movies.backend.repository.CastRepository;
import com.movies.backend.repository.ContentRepository;
import com.movies.backend.repository.MetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
@CrossOrigin(origins = "*")

@RestController
public class MovieDataController {




    @Autowired
    private CastRepository castRepository;

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private MetadataRepository metadataRepository;

    @PostMapping("/movies")
    public ResponseEntity<String> createMovieData(@RequestBody MovieDataRequest request) {
        try {
            // Save metadata
            Metadata metadata = request.getMetadata();
            metadataRepository.save(metadata);

            // Save cast
            Cast cast = request.getCast();
            castRepository.save(cast);

            // Set metadata and cast to content
            Content content = request.getContent();
            content.setMetadata(metadata);
            content.setCast(cast);

            // Save content (which includes metadata and cast)
            contentRepository.save(content);

            return new ResponseEntity<>("All movie data created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create movie data: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    @DeleteMapping("/movies/{id}")
    public ResponseEntity<String> deleteEntityById(@PathVariable Long id) {
        try {
            // Find content by ID
            Optional<Content> contentOptional = contentRepository.findById(id);
            if (contentOptional.isPresent()) {
                Content content = contentOptional.get();

                // Delete associated metadata
                Metadata metadata = content.getMetadata();
                if (metadata != null) {
                    metadataRepository.delete(metadata);
                }

                // Delete associated cast
                Cast cast = content.getCast();
                if (cast != null) {
                    castRepository.delete(cast);
                }

                // Delete content
                contentRepository.delete(content);

                return ResponseEntity.ok("Entity with ID " + id + " and its related entities have been deleted.");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete entity: " + e.getMessage());
        }
    }



}
