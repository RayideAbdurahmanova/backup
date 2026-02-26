package com.example.ramazan.prayer.mapper;

import com.example.ramazan.model.IftarMenu;
import com.example.ramazan.model.Restaurant;
import com.example.ramazan.prayer.dto.IftarMenuCreateDto;
import com.example.ramazan.prayer.dto.IftarMenuResponseDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IftarMenuMapper {

    default IftarMenu toEntity(IftarMenuCreateDto dto, Restaurant restaurant){
        IftarMenu menu = new IftarMenu();
        menu.setRestaurant(restaurant);
        menu.setTitle(dto.getTitle());
        menu.setDescription(dto.getDescription());
        menu.setPrice(dto.getPrice());
        menu.setImageUrlsJson(dto.getImageUrlsJson());
        menu.setIsActive(true);
        return menu;
    }
    default IftarMenuResponseDto toDto(IftarMenu menu){
        return IftarMenuResponseDto.builder()
                .id(menu.getId())
                .restaurantId(menu.getRestaurant().getId())
                .title(menu.getTitle())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .imageUrlsJson(menu.getImageUrlsJson())
                .isActive(menu.getIsActive())
                .build();
    }}
