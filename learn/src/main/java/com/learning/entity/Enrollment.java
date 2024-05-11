package com.learning.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Enrollment {

    @Id
    @Column(name = "student_id")
    private int id;

    @Id
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
   
    @Column
    private String Status;

    @Column
    private String review;

    @Column
    private int rating;

}
