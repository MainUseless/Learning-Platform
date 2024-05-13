package com.learning.util;

import jakarta.inject.Inject;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;

public class Notify {

    private String notificationUrl = System.getenv("NOTIFICATION_URL");

    @Inject
    private Client client;
    
    @Inject
    @Context
    private HttpHeaders httpHeaders;

    public void sendNotification(String student_id,String message){
        notificationUrl = "http://go-learn:8082/notification"; // This should be the URL of the notification service
        client.target(notificationUrl)
                .request()
                .header("Authorization", httpHeaders.getHeaderString("Authorization"))
                .post(null); // This will throw an exception if the token is invalid
    }
    
}
