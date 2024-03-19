package com.movies.backend.exectpion.Content;

public class ContentNotFoundException extends RuntimeException{
    public ContentNotFoundException(Long id){
        super("could not found the Content with id "+ id);
    }
}
