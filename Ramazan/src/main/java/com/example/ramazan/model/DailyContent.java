package com.example.ramazan.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Entity
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "daily_contents",
        uniqueConstraints = @UniqueConstraint(columnNames = "date"))
public class DailyContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @Column(nullable = false)
    LocalDate date;
    @Column(nullable = false)
    String ayahText;
    String ayahSource;
    @Column(nullable = false)
    String duaText;
    String duaSource;
}
