package com.example.ramazan.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.time.ZoneId;

@Configuration
@Data
public class TimeConfig {
    @Value("${prayer.deafult.tz:4.0}")
    private double defaultTz;
    public static final ZoneId zoneId= ZoneId.of("Asia/Baku");
}
