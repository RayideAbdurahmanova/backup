package com.example.ramazan.prayer.mapper;


import com.example.ramazan.model.DailyContent;
import com.example.ramazan.prayer.dto.DailyContentCreateDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.Optional;

@Mapper(componentModel = "spring")
public interface DailyContentMapper {

    DailyContent toEntity(DailyContentCreateDto dto);

    void updateEntity(DailyContentCreateDto dto,
                      @MappingTarget DailyContent entity);}
