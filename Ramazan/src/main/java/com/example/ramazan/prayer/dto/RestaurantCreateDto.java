package com.example.ramazan.prayer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RestaurantCreateDto {
    @NotBlank(message = "Restaurant cannot be empty")
    @Size(max = 100, message = "Restaurant name is too long")
    private String name;
    @NotBlank(message = "Address cannot be empty")
    @Size(max = 255, message = "Address is too long")
    private String address;
    @NotBlank(message = "City cannot be empty")
    @Size(max = 50, message = "City is too long")
    private String city;
    @NotBlank(message = "Phone number cannot be empty")
    @Size(max = 20, message = "Phone number is too long")
    private String phone;
    @NotNull(message = "Latitude cannot be null")
    private Double latitude;
    @NotNull(message = "Longitude cannot be null")
    private Double longitude;
    private String link1;
    private String link2;
    private String link3;
    private String link4;
    private String link5;
    private String coverImageUrl;
    private String openTime;
    private String closeTime;
    @NotBlank(message = "Email cannot be empty")
    @Size(max = 50, message = "Email is too long")
    private String email;

}
