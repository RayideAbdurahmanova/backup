package com.example.ramazan.prayer.dto;



import java.time.LocalTime;
import java.util.Map;

public record PrayerTimesResponse(
        String city,
        String date,
        String imsak,
        String iftar,
        Map<String, String> fullTimes
) {}
