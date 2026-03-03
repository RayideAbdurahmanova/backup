package com.example.ramazan.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;


@Data
@Entity
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "iftar_menus")
public class IftarMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    Restaurant restaurant;
    @Column(nullable = false)
    String title;
    @Column(columnDefinition = "TEXT")
    String description;
    BigDecimal price;
    @Lob
    @Column(columnDefinition = "MEDIUMBLOB",name = "cover_image_url")
    byte[] coverImageUrl;
    @Column(name = "cover_image_type", length = 50)
    private String coverImageType;
    Boolean isActive=true;

}
