package com.learning.entity;


import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({
    @NamedQuery(name = "Course.getByInstructorId", query = "SELECT c FROM Course c WHERE c.instructorId = :instructorId"),
    @NamedQuery(name = "Course.getByStatus", query = "SELECT c FROM Course c WHERE c.status = :status"),
    @NamedQuery(name = "Course.getByCategory", query = "SELECT c FROM Course c WHERE lower(c.category) like lower(concat('%',:category,'%')) AND c.status = 'APPEOVED'"),
    @NamedQuery(name = "Course.getById", query = "SELECT c FROM Course c WHERE c.id = :id"),
    @NamedQuery(name = "Course.getByName", query = "SELECT c FROM Course c WHERE lower(c.name) like lower(concat('%',:name,'%')) AND c.status = 'APPEOVED'"),
    @NamedQuery(name = "Course.deleteById", query = "DELETE FROM Course c WHERE c.id = :id"),
    @NamedQuery(name = "Course.deleteByIdAndInstructorId", query = "DELETE FROM Course c WHERE c.id = :id AND c.instructorId = :instructorId"),
    @NamedQuery(name = "Course.updateStatus", query = "UPDATE Course c SET c.status = :status WHERE c.id = :id"),
    @NamedQuery(name = "Course.getNameById", query = "SELECT c.name FROM Course c WHERE c.id = :id"),
    @NamedQuery(name = "Course.getRating", query="SELECT AVG(e.rating) FROM Enrollment e WHERE e.course.id = :id"),
    @NamedQuery(name = "Course.getAll", query="SELECT c FROM Course c"),
    @NamedQuery(name = "Course.getByIdAndRating", query="SELECT c, AVG(e.rating) FROM Course c left JOIN Enrollment e ON c.id = e.course.id WHERE c.id = :id GROUP BY c.id ORDER BY AVG(e.rating) DESC"),
    @NamedQuery(name = "Course.getByInstructorIdAndRating", query="SELECT c, AVG(e.rating) FROM Course c left JOIN Enrollment e ON c.id = e.course.id WHERE c.instructorId = :instructorId GROUP BY c.id ORDER BY AVG(e.rating) DESC"),
    @NamedQuery(name = "Course.getByStatusAndRating", query="SELECT c, AVG(e.rating) FROM Course c left JOIN Enrollment e ON c.id = e.course.id WHERE c.status = :status GROUP BY c.id ORDER BY AVG(e.rating) DESC"),
    @NamedQuery(name = "Course.getByNameAndRating", query="SELECT c, AVG(e.rating) FROM Course c left JOIN Enrollment e ON c.id = e.course.id WHERE lower(c.name) like lower(concat('%',:name,'%')) GROUP BY c.id ORDER BY AVG(e.rating) DESC"),
    @NamedQuery(name = "Course.getByCategoryAndRating", query="SELECT c, AVG(e.rating) FROM Course c left JOIN Enrollment e ON c.id = e.course.id WHERE lower(c.category) like lower(concat('%',:category,'%')) GROUP BY c.id ORDER BY AVG(e.rating) DESC"),
})

public class Course implements java.io.Serializable{
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    private int id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "duration", nullable = false)
    private int duration;

    @Column(name = "capacity", nullable = false)
    private int capacity;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "instructor_id", nullable = false)
    private int instructorId;

    @OneToMany(mappedBy="course" ,fetch = FetchType.EAGER) 
    private Set<Enrollment> enrollments;


    public Course(int id, String name, String content, String category, int duration, int capacity, String status, int instructorId){
        this.id = id;
        this.name = name;
        this.content = content;
        this.category = category;
        this.duration = duration;
        this.capacity = capacity;
        this.status = status;
        this.instructorId = instructorId;
    }

    // @Column(name = "rating",columnDefinition = "double default 0")
    // private double rating;

    // public void calculateRating(){
    //     int sum = 0;
    //     int count = 0;
    //     for(Enrollment e: enrollments){
    //         if(e.getRating() != 0 && !e.getStatus().toUpperCase().equals("PENDING")){
    //             sum += e.getRating();
    //             count++;
    //         }
    //     }
    //     if(count == 0)
    //         rating = 0;
    //     else
    //         rating = sum/count;
    // }

}
