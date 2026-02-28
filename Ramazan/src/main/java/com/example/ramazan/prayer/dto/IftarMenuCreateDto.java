package com.example.ramazan.prayer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NonNull;

import java.math.BigDecimal;


@Data
public class IftarMenuCreateDto {
    @NotNull(message = "RestaurantID cannot be null")
    Integer restaurantId;
    @NotBlank(message = "Title cannot be null")
    @Size(max = 50, message = "Title is too long")
    String title;
    @NotBlank(message = "Description cannot be null")
    String description;
    @NotNull(message= "Price cannot be null")
    BigDecimal price;
    @NotBlank(message = "Image cannot be null")
    String imageUrlsJson;
    Boolean isActive = true;
}
