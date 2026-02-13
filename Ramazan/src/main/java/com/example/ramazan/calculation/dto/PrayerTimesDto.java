package com.example.ramazan.calculation.dto;

import java.time.LocalDate;
import java.util.Map;

public record PrayerTimesDto(
        LocalDate date,
        double latitude,
        double longitude,
        double tz,
        String method,
        String imsak,     // HH:mm:ss
        String iftar,     // HH:mm:ss (maghrib)
        Map<String, String> fullTimes // eyni map, sadəcə HH:mm:ss
) {}
