package com.example.ramazan.calculation.engine;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class PrayerTime {

    private static final Map<String, String> TIME_NAMES = Map.of(
            "imsak", "İmsak",
            "fajr", "Sübh",
            "sunrise", "Günəş çıxışı",
            "dhuhr", "Zöhr",
            "asr", "Əsr",
            "sunset", "Günəş batışı",
            "maghrib", "Məğrib",
            "isha", "İşa",
            "midnight", "Gecə yarısı"
    );

    private static final Map<String, MethodParams> METHODS = Map.of(
            "MWL", new MethodParams(18.0, 17.0),
            "ISNA", new MethodParams(15.0, 15.0),
            "Egypt", new MethodParams(19.5, 17.5),
            "Makkah", new MethodParams(18.5, 90.0, true),
            "Karachi", new MethodParams(18.0, 18.0),
            "Tehran", new MethodParams(17.7, 14.0, 4.5, "Jafari"),
            "Jafari", new MethodParams(16.0, 14.0, 4.0, "Jafari")
    );

    private String calcMethod = "MWL";
    private final Map<String, Object> settings = new HashMap<>();
    private final Map<String, Double> offsets = new HashMap<>();

    private double latitude, longitude, elevation = 0;
    private double timeZone;
    private double julianDate;

    public PrayerTime() {
        this("MWL");
    }

    public PrayerTime(String method) {
        setMethod(method);

        settings.put("dhuhr", "0 min");
        settings.put("asr", "Hanafi");
        settings.put("highLats", "NightMiddle");

        for (String key : TIME_NAMES.keySet()) {
            offsets.put(key, 0.0);
        }
    }

    public void setMethod(String method) {
        if (METHODS.containsKey(method)) {
            adjust(METHODS.get(method).toMap());
            calcMethod = method;

            if ("Tehran".equals(method) || "Jafari".equals(method)) {
                settings.put("asr", "Jafari");
            }
        }
    }

    public void adjust(Map<String, Object> params) {
        settings.putAll(params);
    }

    public void tune(Map<String, Double> timeOffsets) {
        offsets.putAll(timeOffsets);
    }

    public Map<String, String> getPrayerTimes(LocalDate date, double lat, double lng, double tz) {
        return getPrayerTimes(date, lat, lng, 0, tz);
    }

    public Map<String, String> getPrayerTimes(LocalDate date, double lat, double lng, double elv, double tz) {
        this.latitude = lat;
        this.longitude = lng;
        this.elevation = elv;
        this.timeZone = tz;

        this.julianDate = julian(date.getYear(), date.getMonthValue(), date.getDayOfMonth());

        Map<String, Double> times = initialTimes();
        for (int i = 0; i < 2; i++) {
            times = computePrayerTimesInternal(times);
        }

        times = adjustTimes(times);

        double night = timeDiff(times.get("sunset"), times.get("fajr"));
        times.put("midnight", times.get("sunset") + night / 2);

        for (var key : times.keySet()) {
            times.computeIfPresent(key, (k, v) -> v + offsets.getOrDefault(k, 0.0) / 60.0);
        }

        Map<String, String> formatted = new LinkedHashMap<>();
        for (var entry : times.entrySet()) {
            String azName = TIME_NAMES.getOrDefault(entry.getKey(), entry.getKey());
            formatted.put(azName, formatTime(entry.getValue()));
        }

        return formatted;
    }

    private Map<String, Double> initialTimes() {
        Map<String, Double> times = new HashMap<>();
        times.put("imsak", 5.0);
        times.put("fajr", 5.0);
        times.put("sunrise", 6.0);
        times.put("dhuhr", 12.0);
        times.put("asr", 13.0);
        times.put("sunset", 18.0);
        times.put("maghrib", 18.0);
        times.put("isha", 18.0);
        return times;
    }

    private Map<String, Double> computePrayerTimesInternal(Map<String, Double> times) {
        Map<String, Double> dayPort = dayPortion(times);

        double dhuhr = midDay(dayPort.get("dhuhr"));
        double fajr = sunAngleTime(eval(settings.get("fajr")), dayPort.get("fajr"), true);
        double imsak = fajr - 5.0 / 60.0;  // Sübhdən 5 dəqiqə əvvəl
        double sunrise = sunAngleTime(riseSetAngle(), dayPort.get("sunrise"), true);
        double asr = asrTime(asrFactor(settings.get("asr")), dayPort.get("asr"));
        double sunset = sunAngleTime(riseSetAngle(), dayPort.get("sunset"), false);
        double maghrib = sunAngleTime(eval(settings.get("maghrib")), dayPort.get("maghrib"), false);
        double isha = sunAngleTime(eval(settings.get("isha")), dayPort.get("isha"), false);

        Map<String, Double> result = new HashMap<>();
        result.put("imsak", imsak);
        result.put("fajr", fajr);
        result.put("sunrise", sunrise);
        result.put("dhuhr", dhuhr);
        result.put("asr", asr);
        result.put("sunset", sunset);
        result.put("maghrib", maghrib);
        result.put("isha", isha);
        return result;
    }

    private double midDay(double time) {
        double eqt = sunPosition(julianDate + time).getEquation();
        return fixHour(12 - eqt);
    }

    private double sunAngleTime(double angle, double time, boolean ccw) {
        var pos = sunPosition(julianDate + time);
        double decl = pos.getDeclination();
        double noon = midDay(time);
        double numerator = -Math.sin(Math.toRadians(angle)) - Math.sin(Math.toRadians(decl)) * Math.sin(Math.toRadians(latitude));
        double denominator = Math.cos(Math.toRadians(decl)) * Math.cos(Math.toRadians(latitude));
        double x = numerator / denominator;
        x = Math.max(-1, Math.min(1, x));
        double t = Math.toDegrees(Math.acos(x)) / 15.0;
        return noon + (ccw ? -t : t);
    }

    private double asrTime(double factor, double time) {
        var pos = sunPosition(julianDate + time);
        double decl = pos.getDeclination();
        double angle = -Math.toDegrees(Math.atan(1.0 / (factor + Math.tan(Math.toRadians(Math.abs(latitude - decl))))));
        return sunAngleTime(angle, time, false);
    }

    private SunPosition sunPosition(double jd) {
        double D = jd - 2451545.0;
        double g = fixAngle(357.529 + 0.98560028 * D);
        double q = fixAngle(280.459 + 0.98564736 * D);
        double L = fixAngle(q + 1.915 * Math.sin(Math.toRadians(g)) + 0.020 * Math.sin(Math.toRadians(2 * g)));
        double e = 23.439 - 0.00000036 * D;
        double RA = Math.toDegrees(Math.atan2(
                Math.cos(Math.toRadians(e)) * Math.sin(Math.toRadians(L)),
                Math.cos(Math.toRadians(L))
        )) / 15.0;
        double eqt = q / 15.0 - fixHour(RA);
        double decl = Math.toDegrees(Math.asin(Math.sin(Math.toRadians(e)) * Math.sin(Math.toRadians(L))));
        return new SunPosition(decl, eqt);
    }

    private double julian(int year, int month, int day) {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        int a = year / 100;
        int b = 2 - a + (a / 4);
        return Math.floor(365.25 * (year + 4716))
                + Math.floor(30.6001 * (month + 1))
                + day + b - 1524.5;
    }

    private double riseSetAngle() {
        return 0.833 + 0.0347 * Math.sqrt(elevation);
    }

    private double asrFactor(Object asrParam) {
        if ("Hanafi".equals(asrParam)) return 2.0;
        if ("Standard".equals(asrParam)) return 1.0;
        if ("Jafari".equals(asrParam)) return 1.5;
        return eval(asrParam);
    }

    private Map<String, Double> adjustTimes(Map<String, Double> times) {
        Map<String, Double> result = new HashMap<>();
        for (var entry : times.entrySet()) {
            result.put(entry.getKey(), entry.getValue() + timeZone - longitude / 15.0);
        }
        return result;
    }

    private Map<String, Double> dayPortion(Map<String, Double> times) {
        Map<String, Double> result = new HashMap<>();
        for (var e : times.entrySet()) {
            result.put(e.getKey(), e.getValue() / 24.0);
        }
        return result;
    }

    private double timeDiff(Double t1, Double t2) {
        return fixHour(t2 - t1);
    }

    private double eval(Object val) {
        if (val instanceof Number n) return n.doubleValue();
        String s = String.valueOf(val).replaceAll("[^0-9.\\-+]", "");
        return s.isEmpty() ? 0 : Double.parseDouble(s);
    }

    private double fixHour(double a) {
        a = a - 24 * Math.floor(a / 24);
        return a < 0 ? a + 24 : a;
    }

    private double fixAngle(double a) {
        a = a - 360 * Math.floor(a / 360);
        return a < 0 ? a + 360 : a;
    }

    private String formatTime(double time) {
        if (Double.isNaN(time)) return "-----";
        time = fixHour(time + 0.5 / 60);
        int h = (int) time;
        int m = (int) ((time - h) * 60);
        return String.format("%02d:%02d", h, m);
    }

}
