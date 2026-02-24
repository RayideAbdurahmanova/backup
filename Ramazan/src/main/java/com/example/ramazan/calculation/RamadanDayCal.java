package com.example.ramazan.calculation;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class RamadanDayCal {

    private static final LocalDate RAMADAN_START = LocalDate.of(2026, 2, 19);
    private static final int RAMADAN_LENGTH = 30;


    public int getRamadanDay() {
        LocalDate today = LocalDate.now();

        if (today.isBefore(RAMADAN_START)) {
            return 0;
        }

        int day = (int) ChronoUnit.DAYS.between(RAMADAN_START, today) + 1;

        if (day > RAMADAN_LENGTH) {
            return 0;
        }

        return day;
    }
}
