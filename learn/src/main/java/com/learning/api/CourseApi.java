package com.learning.api;


import java.util.List;

import com.learning.entity.Course;
import com.learning.util.Auth;

import jakarta.annotation.Resource;
import jakarta.ejb.EJBContext;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.interceptor.Interceptors;
import jakarta.jms.JMSContext;
import jakarta.jms.JMSDestinationDefinition;
import jakarta.jms.JMSDestinationDefinitions;
import jakarta.jms.Queue;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

@Stateless
@Path("/course")
@Consumes("application/json")
@Produces("application/json")
@Interceptors(Auth.class)
public class CourseApi {

    @Resource
    EJBContext context;
  
    @PersistenceContext(unitName = "DB")
    private EntityManager em;

    @GET
    @Path("/")
    public List<Course> getCourses() {
        return em.createQuery("SELECT c FROM Course c", Course.class).getResultList();
    }

    @POST
    @Path("/")
    public boolean addCourse() {
        // try{
        // Course course = new Course("Java", "Java is a programming language");
        // em.persist(course);
        return true;
        // }catch(Exception e){
        // return false;
        // }
    }

    @PUT
    @Path("/{course_id}")
    public boolean updateCourse() {
        return true;
    }

    @DELETE
    @Path("/{course_id}")
    public boolean deleteCourse() {
        return true;
    }


}