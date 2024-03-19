package com.movies.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "content")
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String type;
    private String year;
    private String imdbID;
    private String plot;



    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "metadata_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Metadata Metadata;



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cast_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Cast cast;

    public com.movies.backend.model.Metadata getMetadata() {
        return Metadata;
    }

    public void setMetadata(com.movies.backend.model.Metadata metadata) {
        Metadata = metadata;
    }

    public Cast getCast() {
        return cast;
    }

    public void setCast(Cast cast) {
        this.cast = cast;
    }


    // Getters and setters




    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getImdbID() {
        return imdbID;
    }

    public void setImdbID(String imdbID) {
        this.imdbID = imdbID;
    }

    public String getPlot() {
        return plot;
    }

    public void setPlot(String plot) {
        this.plot = plot;
    }
}

