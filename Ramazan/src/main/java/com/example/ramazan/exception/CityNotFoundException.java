package com.example.ramazan.exception;

public class CityNotFoundException extends RuntimeException {
    public CityNotFoundException(String cityName) {
        super("City not found: " + cityName);
    }
}
