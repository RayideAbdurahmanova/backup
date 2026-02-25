package com.example.ramazan.prayer.mapper;

import com.example.ramazan.model.Restaurant;
import com.example.ramazan.prayer.dto.RestaurantCreateDto;
import com.example.ramazan.prayer.dto.RestaurantDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RestaurantMapper {

    Restaurant toEntity(RestaurantCreateDto dto);

    void updateEntity(RestaurantCreateDto dto, @MappingTarget Restaurant restaurant);

    RestaurantDto fromEntityToDto(Restaurant restaurant);

}
