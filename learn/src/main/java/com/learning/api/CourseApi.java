package com.learning.api;


import java.util.List;
import java.util.Map;

import com.learning.entity.Course;
import com.learning.util.Auth;
import com.learning.util.JwtParser;

import jakarta.annotation.Resource;
import jakarta.ejb.EJBContext;
import jakarta.ejb.Stateless;
import jakarta.interceptor.Interceptors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.BeanParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;

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
    public Response getCourses(@QueryParam("status") String status,
                            @QueryParam("category") String category, 
                            @QueryParam("name") String name,
                            @QueryParam("mine") boolean mine,
                            @Context HttpHeaders headers){
        
        String authToken = headers.getRequestHeaders().getFirst("Authorization");
        // Get the Authorization header
        Map<String,String> jwt = JwtParser.parse(authToken);
        
        if(jwt == null){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
        
        String role = jwt.get("role");

        if(role.toUpperCase().equals("ADMIN")){
            if(status != null){
                return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByStatus", Course.class).setParameter("status", status).getResultList()).build();
            }
            return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findAll", Course.class).getResultList()).build();
        }else if(role.toUpperCase().equals("INSTRUCTOR")){
            String id = jwt.get("id");
            if(mine){
                return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByInstructorId", Course.class).setParameter("instructorId", Integer.parseInt(id)).getResultList()).build();
            }else{
                if(name != null){
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByName", Course.class).setParameter("name", name).getResultList()).build();
                }else if(category != null){
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByCategory", Course.class).setParameter("category", category).getResultList()).build();
                }
            }
        }else if (role.toUpperCase().equals("STUDENT")){
            if(name != null){
                return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByName", Course.class).setParameter("name", name).getResultList()).build();
            
            }else if(category != null){
                return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByCategory", Course.class).setParameter("category", category).getResultList()).build();
            }
        }else{
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        return null;
    }

    @POST
    @Path("/")
    public Response addCourse(@Context HttpHeaders headers,@BeanParam Course course) {
        // Access headers from the context
        String authToken = headers.getRequestHeaders().getFirst("Authorization");
        // Get the Authorization header
        Map<String,String> jwt = JwtParser.parse(authToken);
        
        if(jwt == null){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
        
        String id = jwt.get("id");
        String role = jwt.get("role");
        
        if(!role.toUpperCase().equals("INSTRUCTOR")){
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        course.setInstructorId(Integer.parseInt(id));
        course.setStatus("PENDING");
        em.persist(course);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/")
    public Response updateCourse(@Context HttpHeaders headers,@QueryParam("status") String status,@PathParam("course_id") int course_id){
        // Access headers from the context
        String authToken = headers.getRequestHeaders().getFirst("Authorization");
        // Get the Authorization header
        Map<String,String> jwt = JwtParser.parse(authToken);

        if(jwt == null){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }

        String role = jwt.get("role");

        if(role.toUpperCase().equals("ADMIN")){
            int affectedRows = em.createNamedQuery("Course.updateStatus").setParameter("status", status).setParameter("id", course_id).executeUpdate();
            if(affectedRows == 0){
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.status(Response.Status.ACCEPTED).build();
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @DELETE
    @Path("/{course_id}")
    public Response deleteCourse(@Context HttpHeaders headers,@PathParam("course_id") int course_id){
        // Access headers from the context
        String authToken = headers.getRequestHeaders().getFirst("Authorization");
        // Get the Authorization header
        Map<String,String> jwt = JwtParser.parse(authToken);

        if(jwt == null){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }

        String role = jwt.get("role");

        if(role.toUpperCase().equals("ADMIN")){
            int affectedRows = em.createNamedQuery("Course.deleteById").setParameter("id", course_id).executeUpdate();
            if(affectedRows == 0){
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.status(Response.Status.ACCEPTED).build();
        }else if(role.toUpperCase().equals("INSTRUCTOR")){
            String id = jwt.get("id");
            int affectedRows = em.createNamedQuery("Course.deleteByIdAndInstructorId").setParameter("id", course_id).setParameter("instructorId", Integer.parseInt(id)).executeUpdate();
            if(affectedRows == 0){
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.status(Response.Status.OK).build();
        }else{
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

    }

}