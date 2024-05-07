package com.learning.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/sample")
public class test {
  @GET
  @Path("/test")
  public String getString() {
    return "test123123123";
  }
}
