package com.learning.api;

import java.util.Map;

import org.javatuples.Pair;

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
            status = status == null ? null : status.toUpperCase();
    
            if(role.toUpperCase().equals("ADMIN")){
                if(status!=null){
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.getByStatusAndRating").setParameter("status", status).getResultList()).build();
                }
                if(name!=null){
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.getByNameAndRating").setParameter("name", name).getResultList()).build();
                }
                return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.getAll").getResultList()).build();
            }else if(role.toUpperCase().equals("INSTRUCTOR") && mine){
                    String id = jwt.get("id");
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.getByInstructorIdAndRating").setParameter("instructorId", Integer.parseInt(id)).getResultList()).build();
            }else{
                if(name!=null){
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.getByNameAndRating").setParameter("name", name).getResultList()).build();
                }else if(category!=null){
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.getByCategoryAndRating").setParameter("category", category).getResultList()).build();
                }
                else{
                    return Response.status(Response.Status.OK).entity(em.createNamedQuery("Course.getByStatusAndRating").setParameter("status", "APPROVED").getResultList()).build();
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
    public Response updateCourse(Course course){
        // Access headers from the context
        String authToken = headers.getRequestHeaders().getFirst("Authorization");
        // Get the Authorization header
        Map<String,String> jwt = JwtParser.parse(authToken);

        if(jwt == null){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }

        String role = jwt.get("role");

        if(course.getId() == 0){
            return Response.status(Response.Status.BAD_REQUEST).entity("course_id is required").build();
        }

        Course oldCourse = em.find(Course.class, course.getId());

        if(oldCourse == null){
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if(role.toUpperCase().equals("ADMIN")){
            if(course.getStatus()!=null&&!course.getStatus().equals("APPROVED") && !course.getStatus().equals("PENDING")){
                return Response.status(Response.Status.BAD_REQUEST).entity("status should be either APPROVED or PENDING").build();
            }
            if(course.getStatus()!=null)
                course.setStatus(course.getStatus().toUpperCase());
            updateCourse(oldCourse, course);
            em.merge(oldCourse);
            return Response.status(Response.Status.ACCEPTED).build();
        }else if(role.toUpperCase().equals("INSTRUCTOR")){
            course.setStatus(null);
            updateCourse(oldCourse, course);
            em.merge(oldCourse);
            return Response.status(Response.Status.ACCEPTED).build();
        }
        else{
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    private void updateCourse(Course c1, Course c2){
        if(c2.getName()!=null)
            c1.setName(c2.getName());
        if(c2.getCategory()!=null)
            c1.setCategory(c2.getCategory());
        if(c2.getContent()!=null)
            c1.setContent(c2.getContent());
        if(c2.getStatus()!=null)
            c1.setStatus(c2.getStatus());
        if(c2.getCapacity()!=0)
            c1.setCapacity(c2.getCapacity());
        if(c2.getDuration()!=0)
            c1.setDuration(c2.getDuration());
    }

    @DELETE
    @Path("/")
    public Response deleteCourse(@QueryParam("course_id") int course_id){
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