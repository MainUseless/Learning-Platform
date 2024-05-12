package com.learning.util;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONObject;

public class JwtParser {
    public static Map<String,String> parse(String token) {
        try{
            String[] chunks = token.split("\\.");
            byte[] decoded = Base64.getDecoder().decode(chunks[1]);
            
            String jsonString = new String(decoded);
    
            JSONObject jsonObject = new JSONObject(jsonString);
    
            // Convert JSONObject to Map
            Map<String, String> map = new HashMap<>();
            for (String key : jsonObject.keySet()) {
                map.put(key, String.valueOf(jsonObject.get(key)));
            }
    
            return map;
        }catch(Exception e){
            return null;
        }
    }
}
