package com.learning.api;


import jakarta.annotation.Resource;
import jakarta.ejb.EJBContext;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.jms.JMSContext;
import jakarta.jms.JMSDestinationDefinition;
import jakarta.jms.JMSDestinationDefinitions;
import jakarta.jms.Queue;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;


@JMSDestinationDefinitions(
    value = {
        @JMSDestinationDefinition(
                name = "java:/queue/HELLOWORLDMDBQueue",
                interfaceName = "jakarta.jms.Queue",
                destinationName = "HelloWorldMDBQueue"
        )
    }
)
@Stateless
@Path("/course")
@Consumes("application/json")
@Produces("application/json")  
public class CourseApi {

    @Resource
    EJBContext context;
  
    @PersistenceContext(unitName = "DB")
    private EntityManager em;

    @Resource(lookup = "java:/queue/HELLOWORLDMDBQueue")
    private transient Queue queue;

    @Inject
    private JMSContext jmsContext;

    @GET
    @Path("/")
    public String getString() {
        return "test123123123";
    }

    @POST
    @Path("/register")
    public boolean registerCourse() {
        jmsContext.createProducer().send(queue, "Course registered");
        // try{
        // Course course = new Course("Java", "Java is a programming language");
        // em.persist(course);
        return true;
        // }catch(Exception e){
        // return false;
        // }
    }

}
