package com.learning.api;

import java.util.Map;

import com.learning.entity.Enrollment;
import com.learning.util.Auth;
import com.learning.util.JwtParser;

import jakarta.annotation.Resource;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.interceptor.Interceptors;
import jakarta.jms.JMSContext;
import jakarta.jms.JMSDestinationDefinition;
import jakarta.jms.JMSDestinationDefinitions;
import jakarta.jms.Queue;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
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
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.HttpHeaders;

@Path("/enrollment")
@Stateless
@JMSDestinationDefinitions(
    value = {
        @JMSDestinationDefinition(
            name = "java:/queue/CourseRegistrationQueue",
            interfaceName = "jakarta.jms.Queue",
            destinationName = "CourseRegistrationQueue"
        )
    }
)
@Interceptors(Auth.class)
@Produces("application/json")
@Consumes("application/json")
public class EnrollmentApi {

    @Resource(lookup = "java:/queue/CourseRegistrationQueue")
    private transient Queue queue;

    @Inject
    private JMSContext jmsContext;

    @Inject
    @Context 
    HttpHeaders headers;

    @PersistenceContext(unitName = "DB")
    private EntityManager em;

    @GET
    @Path("/")
    public Response getAllEnrollments() {

        try{
            String authToken = headers.getRequestHeaders().getFirst("Authorization");
            // Get the Authorization header
            Map<String,String> jwt = JwtParser.parse(authToken);
            
            if(jwt == null){
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("lmao").build();
            }
            
            int id = Integer.parseInt(jwt.get("id"));
            String role = jwt.get("role");

            if(role.toUpperCase().equals("STUDENT")){
                return Response.status(Response.Status.OK).entity(em.createNamedQuery("Enrollment.findByStudentId", Enrollment.class).setParameter("id", id).getResultList()).build();
            }
            else if(role.toUpperCase().equals("INSTRUCTOR")){
                return Response.ok(em.createNamedQuery("Enrollment.findByInstructorId", Enrollment.class).setParameter("instructor_id", id).getResultList()).build();
            }
            
            return Response.status(Response.Status.UNAUTHORIZED).entity("Only students can view enrollments").build();
            
        }catch(Exception e){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
        
    }

    @POST
    @Path("/")
    public Response enrollCourse(@QueryParam("course_id") String courseId){
        try{
            jmsContext.createProducer().send(queue, "ENROLL"+":"+headers.getRequestHeaders().getFirst("Authorization")+":"+courseId);
            return Response.status(Response.Status.ACCEPTED).build();
        }catch(Exception e){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DELETE
    @Path("/")
    public Response dropCourse(@QueryParam("course_id") String courseId) {
        try{
            jmsContext.createProducer().send(queue, "UNENROLL"+":"+headers.getRequestHeaders().getFirst("Authorization")+":"+courseId);
            return Response.status(Response.Status.ACCEPTED).build();
        }catch(Exception e){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PUT
    @Path("/")
    public Response updateEnrollment(@QueryParam("course_id") String courseId,@QueryParam("status") String status){
        try{
            jmsContext.createProducer().send(queue, "UPDATE"+":"+headers.getRequestHeaders().getFirst("Authorization")+":"+courseId+":"+status);
            return Response.status(Response.Status.ACCEPTED).build();
        }catch(Exception e){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @POST
    @Path("/review")
    public Response reviewCourse(Map<String,String> review){
        try{
            // if(review.get("review") == null || review.get("course_id") == null){
            //     return Response.status(Response.Status.BAD_REQUEST).entity("Provide course_id and review").build();
            // }
            String authToken = headers.getRequestHeaders().getFirst("Authorization");
            // Get the Authorization header
            Map<String,String> jwt = JwtParser.parse(authToken);

            if(jwt == null){
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }

            if(review.get("review") == null || review.get("course_id") == null || review.get("rating") == null){
                return Response.status(Response.Status.BAD_REQUEST).entity("Provide course_id, review and rating").build();
            }

            String student_id = jwt.get("id");
            String role = jwt.get("role");

            if(!role.toUpperCase().equals("STUDENT")){
                return Response.status(Response.Status.UNAUTHORIZED).entity("Only students can review").build();
            }
            
            Enrollment isEnrolled =  em.createNamedQuery("Enrollment.findByCourseIdAndStudentId",Enrollment.class).setParameter("course_id", Integer.valueOf(review.get("course_id"))).setParameter("id",Integer.valueOf(student_id)).getSingleResult();
            
            isEnrolled.setReview(review.get("review"));
            isEnrolled.setRating(Double.valueOf(review.get("rating")));

            em.merge(isEnrolled);

            return Response.status(Response.Status.ACCEPTED).build();
        }catch(NoResultException e){
            return Response.status(Response.Status.BAD_REQUEST).entity("You are not enrolled in this course").build();
        }
        catch(Exception e){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }
    
}
