
package com.learning.util;

import java.util.ArrayList;
import java.util.logging.Logger;
import jakarta.ejb.ActivationConfigProperty;
import jakarta.ejb.MessageDriven;
import jakarta.jms.JMSException;
import jakarta.jms.Message;
import jakarta.jms.MessageListener;
import jakarta.jms.TextMessage;

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
                        break;
                    case "UNENROLL":
                        LOGGER.info("Unenrolling student " + message[1] + " from course " + message[2]);
                        break;
                    case "UPDATE":
                        LOGGER.info("Updating course " + message[1]);
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
    
}