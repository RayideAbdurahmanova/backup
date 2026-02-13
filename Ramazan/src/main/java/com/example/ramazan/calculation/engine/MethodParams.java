package com.example.ramazan.calculation.engine;

import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Getter
public class MethodParams {
    private double fajr;
    private double isha;
    private double maghrib;
    private String midnight;
    private boolean ishaMin;


    public MethodParams(double fajr, double isha) {
        this.fajr = fajr;
        this.isha = isha;
    }

    public MethodParams(double fajr, double isha, boolean ishaMin) {
        this.fajr = fajr;
        this.isha = isha;
        this.ishaMin = ishaMin;
    }

    public MethodParams(double fajr, double isha, double maghrib, String midnight) {
        this.fajr = fajr;
        this.isha = isha;
        this.maghrib = maghrib;
        this.midnight = midnight;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> m = new HashMap<>();
        m.put("fajr", fajr);
        m.put("isha", ishaMin ? isha + " min" : isha);
        if (maghrib > 0) m.put("maghrib", maghrib);
        m.put("midnight", midnight);
        return m;
    }
}
