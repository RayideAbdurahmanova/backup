package com.example.ramazan.common.util;

import java.text.Normalizer;

public final class TextNormalizeUtil {
    private TextNormalizeUtil() {}

    public static String normalize(String text) {
        if (text == null) return "";
        return Normalizer.normalize(text.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase();
    }
}
