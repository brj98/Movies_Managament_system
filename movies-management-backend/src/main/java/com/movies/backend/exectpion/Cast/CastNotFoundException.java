package com.movies.backend.exectpion.Cast;

public class CastNotFoundException extends RuntimeException{
    public CastNotFoundException(Long id){
        super("could not found the Misafir with id "+ id);
    }
}
