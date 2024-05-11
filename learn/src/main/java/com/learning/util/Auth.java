package com.learning.util;

import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;

@Interceptor
public class Auth {
    private String authUrl = System.getenv("AUTH_URL");

    @Inject
    private Client client;
    
    @Inject
    @Context
    private HttpHeaders httpHeaders;

    @AroundInvoke
    public Object validate(InvocationContext context)throws Exception{
        String authToken = httpHeaders.getHeaderString("Authorization");
        if(authToken == null){
            throw new Exception("Authorization token not found");
        }
        System.out.println("Auth token: " + authToken);

    return context.proceed(); // Call the actual endpoint method
  }

}
