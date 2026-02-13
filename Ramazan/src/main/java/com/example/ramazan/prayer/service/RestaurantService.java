package com.example.ramazan.prayer.service;

import com.example.ramazan.common.util.DistanceUtil;
import com.example.ramazan.exception.RestaurantNotFoundException;
import com.example.ramazan.model.Restaurant;
import com.example.ramazan.prayer.dto.RestaurantCreateDto;
import com.example.ramazan.prayer.mapper.RestaurantMapper;
import com.example.ramazan.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    public List<Restaurant> nearBy(double lat,double lng,double radiusKm){
         return restaurantRepository.findAll()
                 .stream()
                 .map(r->new RestaurantDistance(
                         r,
                         DistanceUtil.haversine(
                                 lat,lng,
                                 r.getLatitude(),r.getLongitude())
                 ))
                 .filter(rd->rd.distance<=radiusKm)
                 .sorted(Comparator.comparingDouble(rd->rd.distance))
                 .map(rd->rd.restaurant)
                 .toList();
    }

    public Restaurant getById(Integer id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found"));
    }
    private record RestaurantDistance(Restaurant restaurant, double distance) {}

    public Restaurant create(RestaurantCreateDto restaurant){
        Restaurant newRestaurant=restaurantMapper.toEntity(restaurant);
        Restaurant saved = restaurantRepository.save(newRestaurant);
        return  saved;
    }

    public void delete(Integer id) {
        Restaurant restaurant = getById(id);
        restaurantRepository.delete(restaurant);
    }

    public Restaurant update(Integer id, RestaurantCreateDto restaurantDetails) {
        Restaurant restaurant = getById(id);
        restaurantMapper.updateEntity(restaurantDetails, restaurant);
        return restaurantRepository.save(restaurant);
    }

    public String saveImage(MultipartFile file) throws IOException {

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path uploadPath = Paths.get("uploads");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath);

        return "/uploads/" + fileName;
    }



}
