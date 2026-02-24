package com.example.ramazan.prayer.controller;


import com.example.ramazan.prayer.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(
            @RequestParam String title,
            @RequestParam String body) {

        notificationService.sendToAll(title, body);
        return ResponseEntity.ok("Notification sent successfully");
    }
}