package com.example.ramazan.enums;

public enum CalculationMethod {
    MWL, //--
    ISNA, //--
    Egypt,
    Makkah, //--
    Karachi,
    Tehran,
    CAUCASUS,
    Jafari;


    public static CalculationMethod fromString(String method) {
        if (method == null || method.isBlank()) {
            return MWL;
        }

        try {
            return CalculationMethod.valueOf(method);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid calculation method: '" + method +
                    "'. Allowed values: MWL, ISNA, Egypt, Makkah, Karachi, Tehran,CAUCASUS, Jafari");
        }
    }
}
