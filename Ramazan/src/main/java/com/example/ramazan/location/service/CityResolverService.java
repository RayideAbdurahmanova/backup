package com.example.ramazan.location.service;

import com.example.ramazan.common.util.GeoUtil;
import com.example.ramazan.common.util.TextNormalizeUtil;
import com.example.ramazan.calculation.model.AzerbaijanCities;
import com.example.ramazan.location.dto.ResolvedCity;
import org.springframework.stereotype.Service;

import java.util.Comparator;

@Service
public class CityResolverService {

    private static final ResolvedCity DEFAULT_BAKU = new ResolvedCity("Bakı", 40.3953, 49.8822);

    public ResolvedCity resolveCityByCoords(double lat, double lng) {
        AzerbaijanCities.City nearest = AzerbaijanCities.CITIES.stream()
                .min(Comparator.comparingDouble(c ->
                        GeoUtil.haversineKm(lat, lng, c.latitude(), c.longitude())))
                .orElse(null);

        if (nearest == null) {
            return new ResolvedCity("Məkanınız", lat, lng);
        }

        return new ResolvedCity(nearest.name(), lat, lng);
    }

    public ResolvedCity resolveCityByName(String city) {
        if (city == null || city.isBlank()) return DEFAULT_BAKU;

        String normalizedCity = TextNormalizeUtil.normalize(city);

        return AzerbaijanCities.CITIES.stream()
                .filter(c -> TextNormalizeUtil.normalize(c.name()).equals(normalizedCity))
                .findFirst()
                .map(c -> new ResolvedCity(c.name(), c.latitude(), c.longitude()))
                .orElseThrow(() -> new IllegalArgumentException("Şəhər tapılmadı: " + city));
    }

    public ResolvedCity defaultCity() {
        return DEFAULT_BAKU;
    }
}
