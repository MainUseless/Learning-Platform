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
    @NamedQuery(name = "Course.findByInstructorId", query = "SELECT c FROM Course c WHERE c.instructorId = :instructorId"),
    @NamedQuery(name = "Course.findByStatus", query = "SELECT c FROM Course c WHERE c.status = :status"),
    @NamedQuery(name = "Course.findByCategory", query = "SELECT c FROM Course c WHERE c.category = :category AND c.status = 'APPEOVED'"),
    @NamedQuery(name = "Course.findById", query = "SELECT c FROM Course c WHERE c.id = :id"),
    @NamedQuery(name = "Course.findByName", query = "SELECT c FROM Course c WHERE lower(c.name) like lower(concat('%',:name,'%')) AND c.status = 'APPEOVED'"),
    @NamedQuery(name = "Course.deleteById", query = "DELETE FROM Course c WHERE c.id = :id"),
    @NamedQuery(name = "Course.deleteByIdAndInstructorId", query = "DELETE FROM Course c WHERE c.id = :id AND c.instructorId = :instructorId"),
    @NamedQuery(name = "Course.updateStatus", query = "UPDATE Course c SET c.status = :status WHERE c.id = :id"),
    @NamedQuery(name = "Course.getNameById", query = "SELECT c.name FROM Course c WHERE c.id = :id"),
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

}
