package com.example.ramazan.repository;

import com.example.ramazan.model.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceTokenRepository extends JpaRepository<DeviceToken,Long> {

    boolean existsByToken(String token);

    Optional<DeviceToken> findByToken(String token);
}
