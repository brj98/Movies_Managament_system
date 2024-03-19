package com.movies.backend.exectpion.Metadata;

public class MetadataNotFoundException extends RuntimeException{
    public MetadataNotFoundException(Long id){
        super("could not found the Metadata with id "+ id);
    }
}
