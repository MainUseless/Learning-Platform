package com.learning.api;

import java.util.Map;

import com.learning.dto.Account;

import jakarta.ejb.Stateless;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/users")
@Stateless
public class UsersApi {

    @POST
    @Path("/")
    public boolean addUser(Map<String, String> user){

        if(!Account.Role.contains(user.get("role"))){
            return false;
        }

        if(user.get("role").equals("STUDENT")){
            

        }else if(user.get("role").equals("INSTRUCTOR")){

        }


        return true;
        
    }
}
