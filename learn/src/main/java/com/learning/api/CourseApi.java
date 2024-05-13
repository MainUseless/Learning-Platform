package com.learning.api;

import java.util.Map;

import com.learning.entity.Course;
import com.learning.util.Auth;
import com.learning.util.JwtParser;

import jakarta.annotation.Resource;
import jakarta.ejb.EJBContext;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.interceptor.Interceptors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


@Stateless
@Path("/course")
@Consumes("application/json")
@Produces("application/json")
@Interceptors(Auth.class)
public class CourseApi {

    @Resource
    EJBContext context;

    @Inject
    @Context 
    HttpHeaders headers;
   
    @PersistenceContext(unitName = "DB")
    private EntityManager em;

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCourses(@QueryParam("status") String status,
                            @QueryParam("category") String category, 
                            @QueryParam("name") String name,
                            @QueryParam("mine") boolean mine){
        try{

            String authToken = headers.getRequestHeaders().getFirst("Authorization");
            // Get the Authorization header
            Map<String,String> jwt = JwtParser.parse(authToken);
            
            if(jwt == null){
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
            
            String role = jwt.get("role");
    
            if(role.toUpperCase().equals("ADMIN")){
                if(status!=null){
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByStatus", Course.class).setParameter("status", status).getResultList()).build();
                }
                return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findAll", Course.class).getResultList()).build();
            }else if(role.toUpperCase().equals("INSTRUCTOR") && mine){
                    String id = jwt.get("id");
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByInstructorId", Course.class).setParameter("instructorId", Integer.parseInt(id)).getResultList()).build();
            }else{
                if(name!=null){
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByName", Course.class).setParameter("name", name).getResultList()).build();
                }else if(category!=null){
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByCategory", Course.class).setParameter("category", category).getResultList()).build();
                }
                else{
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.findByStatus", Course.class).setParameter("status", "APPROVED").getResultList()).build();
                }
            }
        }catch(Exception e){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    @POST
    @Path("/")
    public Response addCourse(Course course) {
        try{
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
            
            // return Response.status(Response.Status.CREATED).entity(course).build();
            course.setInstructorId(Integer.parseInt(id));
            course.setStatus("PENDING");
            em.persist(course);
            return Response.status(Response.Status.CREATED).build();
        }catch(Exception e){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    @PUT
    @Path("/")
    public Response updateCourse(@QueryParam("status") String status,@QueryParam("course_id") int course_id){
        // Access headers from the context
        String authToken = headers.getRequestHeaders().getFirst("Authorization");
        // Get the Authorization header
        Map<String,String> jwt = JwtParser.parse(authToken);

        if(jwt == null){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }

        String role = jwt.get("role");
        // return Response.status(Response.Status.FOUND).entity(status).build();

        if(role.toUpperCase().equals("ADMIN")){
            if(status == null || course_id == 0){
                return Response.status(Response.Status.BAD_REQUEST).entity("status and course_id are required").build();
            }
            if(!status.equals("APPROVED") && !status.equals("REJECTED")){
                return Response.status(Response.Status.BAD_REQUEST).entity("status should be either APPROVED or REJECTED").build();
            }
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
    public Response deleteCourse(@PathParam("course_id") int course_id){
        // Access headers from the context
        String authToken = headers.getRequestHeaders().getFirst("Authorization");
        // Get the Authorization header
        Map<String,String> jwt = JwtParser.parse(authToken);

        if(jwt == null){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }

        String role = jwt.get("role");

        if(course_id == 0){
            return Response.status(Response.Status.BAD_REQUEST).entity("course_id is required").build();
        }

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