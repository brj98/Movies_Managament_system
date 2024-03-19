package com.movies.backend.controller;


import com.movies.backend.exectpion.Content.ContentNotFoundException;
import com.movies.backend.model.Content;
import com.movies.backend.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
public class ContentController {

    @Autowired
    private ContentRepository contentRepository;

    @PostMapping("/contents")
    public Content createContent(@RequestBody Content content) {
        return contentRepository.save(content);
    }

    @GetMapping("/contents")
    public List<Content> getAllContents() {
        return contentRepository.findAll();
    }

    @GetMapping("/contents/{id}")
    public Content getContentById(@PathVariable Long id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new ContentNotFoundException(id));
    }

    @PutMapping("/contents/{id}")
    public Content updateContent(@RequestBody Content newContent, @PathVariable Long id) {
        return contentRepository.findById(id)
                .map(content -> {
                    content.setTitle(newContent.getTitle());
                    content.setType(newContent.getType());
                    content.setYear(newContent.getYear());
                    content.setImdbID(newContent.getImdbID());
                    return contentRepository.save(content);
                }).orElseThrow(() -> new ContentNotFoundException(id));
    }

    @DeleteMapping("/contents/{id}")
    public String deleteContent(@PathVariable Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new ContentNotFoundException(id));
        contentRepository.delete(content);
        return "Content with id " + id + " has been deleted.";
    }
}