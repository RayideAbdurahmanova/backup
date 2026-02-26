package com.example.ramazan.prayer.dto;

import com.example.ramazan.model.Restaurant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NonNull;

import java.math.BigDecimal;


@Data
public class IftarMenuCreateDto {

    @NonNull
    Integer restaurantId;
    @NotBlank(message = "Title boş ola bilməz")
    @Size(max = 50, message = "Title maksimum 50 simvol ola bilər")
    String title;
    @NotBlank(message = "Decription boş ola bilməz")
    String description;
    @NonNull
    BigDecimal price;
    @NotBlank(message = "Image boş ola bilməz")
    String imageUrlsJson;
    Boolean isActive = true;
}
