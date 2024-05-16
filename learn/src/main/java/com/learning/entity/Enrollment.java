package com.learning.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@NamedQueries({
    // @NamedQuery(name = "Enrollment.findAllWithCourseNameByStudentId", query = "SELECT e,c FROM Enrollment e where e.student_id = :student_id JOIN Course c ON e.course_id = c.id"),
    @NamedQuery(name = "Enrollment.findByStudentId", query = "SELECT e FROM Enrollment e WHERE e.id = :id"),
    @NamedQuery(name = "Enrollment.findByCourseId", query = "SELECT e FROM Enrollment e WHERE e.course.id = :course"),
    @NamedQuery(name = "Enrollment.findByInstructorId", query = "SELECT e FROM Enrollment e WHERE e.status='PENDING' e.course.instructorId = :instructor_id"),
    @NamedQuery(name = "Enrollment.findByStatus", query = "SELECT e FROM Enrollment e WHERE e.Status = :Status"),
    @NamedQuery(name = "Enrollment.findByRating", query = "SELECT e FROM Enrollment e WHERE e.rating = :rating"),
    @NamedQuery(name = "Enrollment.findByCourseIdAndStudentId", query = "Select e FROM Enrollment e WHERE e.course.id = :course_id AND e.id = :id"),
    @NamedQuery(name = "Enrollment.updateStatus", query = "UPDATE Enrollment e SET e.Status = :Status WHERE e.course = :course AND e.id = :id"),
    @NamedQuery(name = "Enrollment.updateRating", query = "UPDATE Enrollment e SET e.rating = :rating WHERE e.course = :course AND e.id = :id"),
    @NamedQuery(name = "Enrollment.updateReview", query = "UPDATE Enrollment e SET e.review = :review WHERE e.course = :course AND e.id = :id"),
    @NamedQuery(name = "Enrollment.countEnrolledByCourseId", query = "SELECT COUNT(e) FROM Enrollment e WHERE e.course = :course"),
})
public class Enrollment {

    @Id
    @Column(name = "student_id")
    private int id;

    @Id
    @ManyToOne
    @JoinColumn(name = "course_id",nullable = false)
    private Course course;
   
    @Column
    private String Status;

    @Column
    private String review;

    @Column
    private double rating;

}
