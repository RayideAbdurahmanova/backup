package com.example.ramazan.common.util;

import com.example.ramazan.config.TimeConfig;



import java.time.*;

public final class TimeUtil {



    public static LocalDateTime now() {
        return LocalDateTime.now(TimeConfig.zoneId);
    }


    public static long remainingTodayFastingCountdown(
            LocalTime imsakTime,
            LocalTime iftarTime
    ) {

        LocalDateTime now = now();
        LocalDate today = now.toLocalDate();

        LocalDateTime imsakDt = LocalDateTime.of(today, imsakTime);
        LocalDateTime iftarDt = LocalDateTime.of(today, iftarTime);

        // imsakdan əvvəl → imsaka qədər
        if (now.isBefore(imsakDt)) {
            return Duration.between(now, imsakDt).getSeconds();
        }

        // imsakdan sonra amma iftardan əvvəl → iftara qədər
        if (now.isBefore(iftarDt)) {
            return Duration.between(now, iftarDt).getSeconds();
        }

        // iftardan sonra → sabahkı imsaka qədər
        LocalDateTime nextImsak = LocalDateTime.of(today.plusDays(1), imsakTime);

        return Duration.between(now, nextImsak).getSeconds();
    }



}
