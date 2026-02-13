package com.example.ramazan.exception;

public class RestaurantNotFoundException  extends RuntimeException {
    public RestaurantNotFoundException(String message) {
        super(message);
    }
}
