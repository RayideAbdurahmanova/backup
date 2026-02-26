package com.example.ramazan.prayer.service;

import com.example.ramazan.calculation.dto.PrayerTimesDto;
import com.example.ramazan.calculation.service.PrayerCalculationService;
import com.example.ramazan.common.util.TimeUtil;
import com.example.ramazan.config.TimeConfig;
import com.example.ramazan.location.dto.ResolvedCity;
import com.example.ramazan.location.service.CityResolverService;
import com.example.ramazan.prayer.dto.PrayerTimesResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.chrono.ChronoLocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrayerService {

    private final CityResolverService cityResolverService;
    private final PrayerCalculationService prayerCalculationService;

    public PrayerTimesResponse getTimes(Double lat,
                                        Double lng,
                                        String city,
                                        String dateStr,
                                        Double tz,
                                        String method) {

        LocalDate requestDate = parseDate(dateStr);

        double usedTz = (tz == null) ? 4.0 : tz;

        ResolvedCity resolved = resolvedCity(lat, lng, city);

        PrayerTimesDto calc = prayerCalculationService.calculate(
                requestDate,
                resolved.latitude(),
                resolved.longitude(),
                usedTz,
                method
        );

        return new PrayerTimesResponse(
                resolved.cityName(),
                requestDate.toString(),
                calc.imsak(),
                calc.iftar(),
                calc.fullTimes()
        );
    }


    public long getFastingCountdown(Double lat,
                                    Double lng,
                                    String city,
                                    Double tz,
                                    String method) {

        double usedTz = (tz == null) ? 4.0 : tz;

        ResolvedCity resolved = resolvedCity(lat, lng, city);


        LocalDate today = LocalDate.now(TimeConfig.zoneId);

        PrayerTimesDto calc = prayerCalculationService.calculate(
                today,
                resolved.latitude(),
                resolved.longitude(),
                usedTz,
                method
        );

        LocalTime imsakTime = LocalTime.parse(calc.imsak().trim());
        LocalTime iftarTime = LocalTime.parse(calc.iftar().trim());

        return TimeUtil.remainingTodayFastingCountdown(
                imsakTime,
                iftarTime
        );
    }




    private ResolvedCity resolvedCity(Double lat,Double lng,String city){
        if(lat!=null&&lng!=null){
            return cityResolverService.resolveCityByCoords(lat,lng);
        }else if (city != null && !city.isBlank()) {
            return cityResolverService.resolveCityByName(city);
        } else {
            return cityResolverService.defaultCity();
        }
    }


    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank() || "today".equalsIgnoreCase(dateStr)) {
            return LocalDate.now(TimeConfig.zoneId);
        }
        return LocalDate.parse(dateStr);
    }
}
