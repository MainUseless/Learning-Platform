package com.learning.dto;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

public class Account implements Serializable{
    public static List<String> Role = Arrays.asList("ADMIN","USER","INSTRUCTOR");
    public String username;
    public String role;
}