package com.movies.backend.controller;

import com.movies.backend.exectpion.Cast.CastNotFoundException;
import com.movies.backend.model.Cast;
import com.movies.backend.repository.CastRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class CastController {

    @Autowired
    private CastRepository castRepository;

    @PostMapping("/casts")
    public Cast createCast(@RequestBody Cast cast) {
        return castRepository.save(cast);
    }

    @GetMapping("/casts")
    public List<Cast> getAllCasts() {
        return castRepository.findAll();
    }

    @GetMapping("/casts/{id}")
    public Cast getCastById(@PathVariable Long id) {
        return castRepository.findById(id)
                .orElseThrow(() -> new CastNotFoundException(id));
    }

    @PutMapping("/casts/{id}")
    public Cast updateCast(@RequestBody Cast newCast, @PathVariable Long id) {
        return castRepository.findById(id)
                .map(cast -> {
                    cast.setActorName(newCast.getActorName());
                    return castRepository.save(cast);
                }).orElseThrow(() -> new CastNotFoundException(id));
    }

    @DeleteMapping("/casts/{id}")
    public String deleteCast(@PathVariable Long id) {
        Cast cast = castRepository.findById(id)
                .orElseThrow(() -> new CastNotFoundException(id));
        castRepository.delete(cast);
        return "Cast with id " + id + " has been deleted.";
    }
}