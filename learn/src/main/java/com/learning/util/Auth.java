package com.learning.util;

import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;

@Interceptor
public class Auth {
    private String authUrl = System.getenv("AUTH_URL");

    @Inject
    private Client client;
    
    @Inject
    @Context
    private HttpHeaders httpHeaders;

    @AroundInvoke
    public Object validate(InvocationContext context){
        
    try {
        String authToken = httpHeaders.getHeaderString("Authorization");
        if(authToken == null){
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        authUrl = "http://go-learn:8081/auth"; // This should be the URL of the authentication service
        Response res = client.target(authUrl)
                .request()
                .header("Authorization", authToken)
                .get(); // This will throw an exception if the token is invalid
        
        if(res.getStatus() != 200){
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        return context.proceed();
    } catch (Exception e) {
        // return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Auth service is not reachable").build();
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()+"====================").build();
    } 
  }

}
