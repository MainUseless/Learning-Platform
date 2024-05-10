package com.learning.util;

import com.learning.dto.account;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.client.Client;

@Stateless
public class auth {
    private String authUrl = System.getenv("AUTH_URL");

    @Inject
    private Client client;
    
    public account Auth(String jwt){
        account response = client.target(authUrl)
            .request()
            .header("Authorization", jwt)
            .get(account.class);
        
        return response;
    }

}
