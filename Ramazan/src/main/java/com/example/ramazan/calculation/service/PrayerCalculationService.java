package com.example.ramazan.calculation.service;

import com.example.ramazan.calculation.engine.PrayerTime;
import com.example.ramazan.calculation.dto.PrayerTimesDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class
PrayerCalculationService {

    public PrayerTimesDto calculate(LocalDate date,
                                    double lat,
                                    double lng,
                                    double tz,
                                    String method) {

        String usedMethod = (method == null || method.isBlank()) ? "MWL" : method.trim();

        PrayerTime engine = new PrayerTime(usedMethod);


        Map<String, String> raw = engine.getPrayerTimes(date, lat, lng, tz);

        Map<String, String> fullTimes = new LinkedHashMap<>();
        for (var e : raw.entrySet()) {
            fullTimes.put(e.getKey(), normalizeToHHmmss(e.getValue()));
        }

        String imsak = normalizeToHHmmss(fullTimes.getOrDefault("İmsak", "-----"));
        String iftar = normalizeToHHmmss(fullTimes.getOrDefault("Məğrib", "-----"));

        return new PrayerTimesDto(date, lat, lng, tz, usedMethod, imsak, iftar, fullTimes);
    }

    private String normalizeToHHmmss(String time) {
        if (time == null) return "-----";
        String t = time.trim();
        if (t.equals("-----")) return t;

        if (t.matches("^\\d{2}:\\d{2}:\\d{2}$")) return t;

        if (t.matches("^\\d{2}:\\d{2}$")) return t + ":00";

        return t;
    }
}
