package com.example.ramazan.prayer.notification;

import com.example.ramazan.model.DeviceToken;
import com.example.ramazan.repository.DeviceTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeviceTokenService {
    private final DeviceTokenRepository repo;

    public void save(String token){

        if(!repo.existsByToken(token)){
            DeviceToken d = new DeviceToken();
            d.setToken(token);
            repo.save(d);
        }
    }
}
