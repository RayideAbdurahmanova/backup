package com.example.ramazan.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "prayer_times")
public class PrayerTimes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @Column(nullable = false)
    LocalDate date;
    @Column(name = "location_key", nullable = false)
    String locationKey;
    LocalTime imsak;
    LocalTime fajr;
    LocalTime sunrise;
    LocalTime dhuhr;
    LocalTime asr;
    LocalTime maghrib;
    LocalTime isha;

}
