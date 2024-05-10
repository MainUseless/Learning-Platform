package com.learning.util;


import java.util.List;
import java.util.stream.Stream;

import com.learning.dto.account;

import jakarta.ejb.Stateless;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

@Stateless
@Path("/role")
@Consumes("application/json")
@Produces("application/json")  
public class role {
    @GET
    @Path("/")
    public List<String> getRoles() {
        return Stream.of(account.Role.values()).map(Enum::name).toList();
    }
}
