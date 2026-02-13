package com.example.ramazan.repository;

import com.example.ramazan.model.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken,Long> {

    boolean existsByToken(String token);

    Optional<DeviceToken> findByToken(String token);
}
