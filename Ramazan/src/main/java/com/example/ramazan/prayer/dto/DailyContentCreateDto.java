package com.example.ramazan.prayer.dto;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DailyContentCreateDto {
    LocalDate date;
    String ayahText;
    String ayahSource;
    String duaText;
    String duaSource;
}
