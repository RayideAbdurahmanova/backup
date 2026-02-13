package com.example.ramazan.prayer.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class IftarMenuResponseDto {

    private Integer id;
    private Integer restaurantId;
    private String title;
    private String description;
    private BigDecimal price;
    private String imageUrlsJson;
    private Boolean isActive;
}
