package com.example.ramazan.prayer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DailyContentCreateDto {
    @NotNull(message = "Date cannot be null")
    private LocalDate date;

    @NotBlank(message = "Ayah text cannot be empty")
    @Size(max = 2000, message = "Ayah text is too long")
    private String ayahText;

    @NotBlank(message = "Ayah source cannot be empty")
    @Size(max = 255, message = "Ayah source is too long")
    private String ayahSource;

    @NotBlank(message = "Dua text cannot be empty")
    @Size(max = 3000, message = "Dua text is too long")
    private String duaText;

    @NotBlank(message = "Dua source cannot be empty")
    @Size(max = 255, message = "Dua source is too long")
    private String duaSource;
}
