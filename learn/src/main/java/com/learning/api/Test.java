package com.learning.api;

import jakarta.ejb.Stateless;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Stateless
@Path("/sample")
public class Test {

	@GET
	@Path("/")
	public String getString() {
		return "test123123123";
	}

}
