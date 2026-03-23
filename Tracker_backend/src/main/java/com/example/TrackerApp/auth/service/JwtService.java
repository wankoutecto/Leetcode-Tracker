package com.example.TrackerApp.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
@Service
public class JwtService {
    @Value("${app.secret-key}")
    private String secretKey; //now contains jwt secret in base64 string
    private Key key;
    
    @PostConstruct //run once at startup
    public void initKey(){
        //convert secretkey to bytes
        //hmac needs bytes not string
        key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey));
    }

    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60000 * 60 * 24))
                .signWith(key)
                .compact();
    }
    public Claims extractClaims(String token){
        return Jwts.parserBuilder().setSigningKey(key)
                .build().parseClaimsJws(token).getBody();
    }
    public String extractUsername(String token){
        return extractClaims(token).getSubject();
    }
    public boolean isTokenExpired(String token){
        return extractClaims(token).getExpiration().before(new Date());
    }
    public boolean isTokenValid(String token, String logUsername){
        try {
            String tokenUsername = extractUsername(token);
            return (logUsername.equals(tokenUsername) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }
}
