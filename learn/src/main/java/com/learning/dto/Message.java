package com.learning.dto;

import java.io.Serializable;

public class Message implements Serializable {
    public String student_id;
    public String message;
    public Message(String student_id,String message){
        this.student_id = student_id;
        this.message = message;
    }
}
