package com.example.ramazan.prayer.controller;

import com.example.ramazan.calculation.RamadanDayCal;
import com.example.ramazan.prayer.dto.PrayerTimesResponse;
import com.example.ramazan.prayer.service.PrayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/prayer")
@RequiredArgsConstructor
@Controller
public class PrayerController {

    private final PrayerService prayerService;
    private final RamadanDayCal ramadanDayCal;

    @GetMapping("/times")
    public PrayerTimesResponse getTimes(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "today") String date,
            @RequestParam(required = false) Double tz,
            @RequestParam(required = false) String method
    ) {
        if((lat!=null &&lng==null)||lat==null&&lng!=null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "lat və lng parametrləri birlikdə göndərilməlidir");
        }

        return prayerService.getTimes(lat, lng, city, date, tz, method);
    }


    @GetMapping("/countdown")
    public long getCountdown(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double tz,
            @RequestParam(defaultValue = "MWL") String method
    ) {
        return prayerService.getFastingCountdown(
                lat,
                lng,
                city,
                tz,
                method
        );
    }


    @GetMapping("/ramadan-day")
    public Map<String, Object> getRamadanDay() {
        int day = ramadanDayCal.getRamadanDay();
        Map<String, Object> res = new HashMap<>();
        if (day == 0) res.put("message", "Ramazan hələ başlamayıb");
        else res.put("ramadanDay", day);
        return res;
    }


}
