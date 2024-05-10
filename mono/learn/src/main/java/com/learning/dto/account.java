package com.learning.dto;

import java.io.Serializable;

public class account implements Serializable{
    public static enum Role{
        ADMIN,
        USER,
        INSTRUCTOR
    }
    public String username;
    public Role role;
}