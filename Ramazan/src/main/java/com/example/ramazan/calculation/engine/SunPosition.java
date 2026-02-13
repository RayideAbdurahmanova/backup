package com.example.ramazan.calculation.engine;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class SunPosition {

    private final double declination;
    private final double equation;

    @Override
    public String toString() {
        return "SunPosition{" +
                "declination=" + declination +
                ", equation=" + equation +
                '}';
    }

}