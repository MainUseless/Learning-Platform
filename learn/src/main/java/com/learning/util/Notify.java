package com.learning.util;

import com.learning.dto.Message;

import jakarta.inject.Inject;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;

public class Notify {

    private String notificationUrl = System.getenv("NOTIFICATION_URL");

    @Inject
    private Client client = ClientBuilder.newClient();

    public void sendNotification(String student_id,String message){
        client.target(notificationUrl)
                .request()
                .post(
                        jakarta.ws.rs.client.Entity.json(
                                new Message(student_id,message)
                        )
                );
    }
    
}
