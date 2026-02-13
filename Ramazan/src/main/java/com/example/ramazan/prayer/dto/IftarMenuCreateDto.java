package com.example.ramazan.prayer.dto;

import com.example.ramazan.model.Restaurant;
import lombok.Data;

import java.math.BigDecimal;


@Data
public class IftarMenuCreateDto {

    Integer restaurantId;
    String title;
    String description;
    BigDecimal price;
    String imageUrlsJson;
    Boolean isActive=true;
}
