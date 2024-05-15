package com.learning.api;

import jakarta.ejb.Stateless;
import jakarta.ws.rs.GET;
// import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Stateless
@Path("/")
public class Test {

	@GET
	public String getString() {
		return "test123123123";
	}

	// @POST
	// public boolean init(){
		
	// }

}
