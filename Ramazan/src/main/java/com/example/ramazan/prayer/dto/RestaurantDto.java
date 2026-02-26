package com.example.ramazan.prayer.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RestaurantDto {

    String name;
    String email;
    String link1;
    String link2;
    String link3;
    String link4;
    String link5;
    String address;
    String city;
    Double latitude;
    Double longitude;
    String phone;
    String coverImageUrl;
    String openTime;
    String closeTime;
    LocalDateTime createdAt;
}
