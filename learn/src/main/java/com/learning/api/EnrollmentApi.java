package com.learning.api;

import java.util.List;

import com.learning.entity.Enrollment;
import com.learning.util.Auth;

import jakarta.annotation.Resource;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.interceptor.Interceptors;
import jakarta.jms.JMSContext;
import jakarta.jms.JMSDestinationDefinition;
import jakarta.jms.JMSDestinationDefinitions;
import jakarta.jms.Queue;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;

@Path("/enrollment")
@Stateless
@Interceptors(Auth.class)
@JMSDestinationDefinitions(
    value = {
        @JMSDestinationDefinition(
            name = "java:/queue/CourseRegistrationQueue",
            interfaceName = "jakarta.jms.Queue",
            destinationName = "CourseRegistrationQueue"
        )
    }
)
public class EnrollmentApi {

    @Resource(lookup = "java:/queue/CourseRegistrationQueue")
    private transient Queue queue;

    @Inject
    private JMSContext jmsContext;

    // @GET
    // @Path("/")
    // public List<Enrollment> getAllEnrollments() {
    //     return true;
    // }

    @POST
    @Path("/{course_id}")
    public boolean enrollCourse() {
        jmsContext.createProducer().send(queue, "Course registered");
        return true;
    }

    @DELETE
    @Path("/{course_id}")
    public boolean dropCourse() {
        return true;
    }

    @PUT
    @Path("/{course_id}/{status}")
    public boolean updateEnrollment() {
        return true;
    }

    @POST
    @Path("/review")
    public boolean reviewCourse() {
        return true;
    }
    
}
