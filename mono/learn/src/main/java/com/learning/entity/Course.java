package com.learning.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    private int id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "content", nullable = false)
    private String content;

    public Course() {}

    public Course(String name, String content) {
        this.name = name;
        this.content = content;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContent() {
        return content;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
