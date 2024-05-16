
package com.learning.util;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import com.learning.entity.Course;
import com.learning.entity.Enrollment;

import jakarta.ejb.ActivationConfigProperty;
import jakarta.ejb.MessageDriven;
import jakarta.jms.JMSException;
import jakarta.jms.Message;
import jakarta.jms.MessageListener;
import jakarta.jms.TextMessage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
/**
 * <p>
 * A simple Message Driven Bean that asynchronously receives and processes the messages that are sent to the queue.
 * </p>
 *
 * @author Serge Pagop (spagop@redhat.com)
 */
@MessageDriven(name = "CourseRegistrationQueueMDB", activationConfig = {
        @ActivationConfigProperty(propertyName = "destinationLookup", propertyValue = "queue/CourseRegistrationQueue"),
        @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "jakarta.jms.Queue"),
        @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge")})
public class CourseRegistrationQueueMDB implements MessageListener {

    private static final Logger LOGGER = Logger.getLogger(CourseRegistrationQueueMDB.class.toString());

    @PersistenceContext(name = "DB")
    private EntityManager em;

    private Notify notify = new Notify();

    /**
     * @see MessageListener#onMessage(Message)
     */
    public void onMessage(Message rcvMessage) {
        TextMessage msg = null;

        try {
            if (rcvMessage instanceof TextMessage) {
                msg = (TextMessage) rcvMessage;
                String[] message = msg.getText().split(":");
                switch (message[0]) {
                    case "ENROLL":
                        LOGGER.info("Enrolling student " + message[1] + " to course " + message[2]);
                        LOGGER.info(enroll(message[1], message[2]));
                        break;
                    case "UNENROLL":
                        LOGGER.info("Unenrolling student " + message[1] + " from course " + message[2]);
                        unenroll(message[1], message[2]);
                        break;
                    case "UPDATE":
                        LOGGER.info("Updating course " + message[1]);
                        updateEnrollment(message[1], message[2], message[3], message[4]);
                        break;
                    default:
                        break;
                }
            } else {
                LOGGER.warning("Message of wrong type: " + rcvMessage.getClass().getName());
            }
        } catch (JMSException e) {
            throw new RuntimeException(e);
        }
    }

    public String enroll(String authToken, String courseId){
        // Get the Authorization header
        Map<String,String> jwt = JwtParser.parse(authToken);
        
        if(jwt == null){
            return "Invalid JWT";
        }

        String student_id = jwt.get("id");
        Course c = em.find(Course.class, Integer.parseInt(courseId));
        if(c == null){
            return "Course not found";
        }

        Set<Enrollment> enrollments = c.getEnrollments();

        int Accepted = 0;
        for(Enrollment en : enrollments){
            if(en.getStatus().equals("ACCEPTED")){
                Accepted++;
            }
        }

        if(Accepted >= c.getCapacity()){
            return "Course is full";
        }

        Enrollment e = new Enrollment();
        
        e.setId(Integer.parseInt(student_id));
        e.setCourse(c);
        e.setStatus("PENDING");

        em.persist(e);

        notify.sendNotification(student_id, "Enrollment Request Sent " + c.getName());

        return "Enrollment Request Sent";   
    }

    public void unenroll(String authToken, String courseId){
        Map<String,String> jwt = JwtParser.parse(authToken);
        
        if(jwt == null){
            return ;
        }

        String student_id = jwt.get("id");
        Course c = em.find(Course.class, Integer.parseInt(courseId));
        if(c == null){
            return ;
        }

        int i = em.createNamedQuery("Enrollment.deleteByCourseIdAndStudentId", Enrollment.class)
                        .setParameter("course_id", c.getId())
                        .setParameter("id", Integer.parseInt(student_id))
                        .executeUpdate();
        
        if(i == 0){
            notify.sendNotification(student_id, "Enrollment Request Not Found " + c.getName());
        }
        else{
            notify.sendNotification(student_id, "Enrollment Request Cancelled " + c.getName());
        }

    }

    public void updateEnrollment(String authToken, String studentId, String courseId, String status){
        Map<String,String> jwt = JwtParser.parse(authToken);
        
        if(jwt == null){
            return ;
        }

        String instructor_id = jwt.get("id");
        Course c = em.find(Course.class, Integer.parseInt(courseId));
        if(c == null || c.getInstructorId()!=(Integer.parseInt(instructor_id))){
            return ;
        }
        LOGGER.info("checkpoint1 ");

        int Accepted = 0;
        for(Enrollment en : c.getEnrollments()){
            if(en.getStatus().equals("ACCEPTED")){
                Accepted++;
            }
        }

        if(Accepted >= c.getCapacity() && status.equals("ACCEPTED")){
            notify.sendNotification(studentId, "Course is full " + c.getName());
            return ;
        }

        Enrollment e = em.createNamedQuery("Enrollment.findByCourseIdAndStudentId", Enrollment.class)
                        .setParameter("course_id", c.getId())
                        .setParameter("id", Integer.parseInt(studentId))
                        .getSingleResult();
        
        if(e == null){
            LOGGER.info("checkpoint2 ");
            return ;
        }

        e.setStatus(status);

        em.persist(e);

        notify.sendNotification(studentId, "Enrollment Request Updated "+status+" "+c.getName());
    }

    
}