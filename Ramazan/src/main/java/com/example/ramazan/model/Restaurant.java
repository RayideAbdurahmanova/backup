package com.example.ramazan.model;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "restaurants")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @Column(nullable = false)
    String name;
    String email;
    @Column(name = "link_1")
    String link1;
    @Column(name = "link_2")
    String link2;
    @Column(name = "link_3")
    String link3;
    @Column(name = "link_4")
    String link4;
    @Column(name = "link_5")
    String link5;
    @Column(nullable = false)
    String address;
    @Column(nullable = false)
    String city;
    @Column(nullable = false)
    Double latitude;
    @Column(nullable = false)
    Double longitude;
    String phone;
    String coverImageUrl;
    String openTime;
    String closeTime;
    @Column(name = "created_at",nullable = false, updatable = false)
    LocalDateTime createdAt;


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
