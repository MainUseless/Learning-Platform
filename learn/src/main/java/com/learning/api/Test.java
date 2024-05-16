package com.learning.api;

import java.util.HashSet;
import java.util.Set;

import com.learning.entity.Course;
import com.learning.entity.Enrollment;
import com.learning.util.Notify;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Stateless
@Path("/")
public class Test {

	@PersistenceContext(unitName = "DB")
	private EntityManager em;

	@GET
	public String getString() {
		return "test123123123";
	}

	@POST
	public boolean init(){
		Notify notify = new Notify();
		notify.sendNotification("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZmZpbGlhdGlvbiI6IklTVFFCIiwiYmlvIjoiaWFtIHRlc3RpbmciLCJlbWFpbCI6InN0dWRlbnRAZ21haWwuY29tIiwiaWQiOjIsIm5hbWUiOiJzdHVkZW50Iiwicm9sZSI6InN0dWRlbnQiLCJ5ZWFyc19vZl9leHBlcmllbmNlIjo5OTl9.E1wWLcmBQen8SjiRvHU1u5sVSpazLTBEUBpaAZmP4mU", "message123123");

		return true;
	}

}
