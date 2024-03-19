package com.movies.backend.controller;


import com.movies.backend.exectpion.Metadata.MetadataNotFoundException;
import com.movies.backend.model.Metadata;
import com.movies.backend.repository.MetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
public class MetadataController {

    @Autowired
    private MetadataRepository metadataRepository;

    @PostMapping("/metadata")
    public Metadata createMetadata(@RequestBody Metadata metadata) {
        return metadataRepository.save(metadata);
    }

    @GetMapping("/metadata")
    public List<Metadata> getAllMetadata() {
        return metadataRepository.findAll();
    }

    @GetMapping("/metadata/{id}")
    public Metadata getMetadataById(@PathVariable Long id) {
        return metadataRepository.findById(id)
                .orElseThrow(() -> new MetadataNotFoundException(id));
    }

    @PutMapping("/metadata/{id}")
    public Metadata updateMetadata(@RequestBody Metadata newMetadata, @PathVariable Long id) {
        return metadataRepository.findById(id)
                .map(metadata -> {
                    metadata.setActors(newMetadata.getActors());
                    metadata.setAwards(newMetadata.getAwards());
                    metadata.setPoster(newMetadata.getPoster());
                    metadata.setCountry(newMetadata.getCountry());
                    metadata.setDirector(newMetadata.getDirector());
                    metadata.setGenre(newMetadata.getGenre());
                    metadata.setLanguage(newMetadata.getLanguage());
                    metadata.setMetascore(newMetadata.getMetascore());
                    metadata.setRated(newMetadata.getRated());
                    metadata.setRatings(newMetadata.getRatings());
                    metadata.setReleased(newMetadata.getReleased());
                    metadata.setResponse(newMetadata.getResponse());
                    metadata.setRuntime(newMetadata.getRuntime());
                    metadata.setWriter(newMetadata.getWriter());
                    metadata.setImdbRating(newMetadata.getImdbRating());
                    metadata.setImdbVotes(newMetadata.getImdbVotes());
                    metadata.setTotalSeasons(newMetadata.getTotalSeasons());
                    return metadataRepository.save(metadata);
                }).orElseThrow(() -> new MetadataNotFoundException(id));
    }

    @DeleteMapping("/metadata/{id}")
    public String deleteMetadata(@PathVariable Long id) {
        Metadata metadata = metadataRepository.findById(id)
                .orElseThrow(() -> new MetadataNotFoundException(id));
        metadataRepository.delete(metadata);
        return "Metadata with id " + id + " has been deleted.";
    }
}