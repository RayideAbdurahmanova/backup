package com.example.ramazan.prayer.service;

import com.example.ramazan.common.DistanceUtil;
import com.example.ramazan.exception.RestaurantNotFoundException;
import com.example.ramazan.model.IftarMenu;
import com.example.ramazan.model.Restaurant;
import com.example.ramazan.prayer.dto.RestaurantCreateDto;
import com.example.ramazan.prayer.dto.RestaurantDto;
import com.example.ramazan.prayer.mapper.RestaurantMapper;
import com.example.ramazan.repository.IftarMenuRepository;
import com.example.ramazan.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;
    private final IftarMenuRepository iftarMenuRepository;

    public List<RestaurantDto> nearBy(double lat, double lng, double radiusKm) {
        return restaurantRepository.findAll()
                .stream()
                .map(r -> new RestaurantDistance(r, DistanceUtil.haversine(lat, lng, r.getLatitude(), r.getLongitude())))
                .filter(rd -> rd.distance <= radiusKm)
                .sorted(Comparator.comparingDouble(rd -> rd.distance))
                .map(rd -> restaurantMapper.fromEntityToDto(rd.restaurant))
                .toList();
    }

    public RestaurantDto getById(Integer id) {

        return restaurantMapper.fromEntityToDto(restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found")));
    }

    private record RestaurantDistance(Restaurant restaurant, double distance) {
    }

    public Restaurant create(RestaurantCreateDto restaurant) {
        Restaurant newRestaurant = restaurantMapper.toEntity(restaurant);
        Restaurant saved = restaurantRepository.save(newRestaurant);
        return saved;
    }

    public void delete(Integer id) {
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new RestaurantNotFoundException("Restaurant tapılmadı: id = " + id)
        );
        restaurantRepository.delete(restaurant);
    }

    public RestaurantDto update(Integer id, RestaurantCreateDto restaurantDetails) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant tapılmadı: id = " + id));
        restaurantMapper.updateEntity(restaurantDetails, restaurant);
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        return restaurantMapper.fromEntityToDto(updatedRestaurant);
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

    public List<IftarMenu> getMenus(Integer id) {
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new RestaurantNotFoundException("Restoran tapılmadı")
        );
        return iftarMenuRepository.findByRestaurant_Id(restaurant.getId());

    }

    public List<RestaurantDto> getMainPageRestaurants() {
        List<Restaurant> promoted = restaurantRepository.findByHasAdvertisementTrue();
        return promoted.stream()
                .map(restaurantMapper::fromEntityToDto)
                .toList();
    }

    public RestaurantDto changeRestaurantToPrompted(Integer id) {
       Restaurant restaurant=restaurantRepository.findById(id).orElseThrow(
               ()-> new RestaurantNotFoundException("Restoran tapılmadı")
       );

        restaurant.setHasAdvertisement(true);
        Restaurant updated = restaurantRepository.save(restaurant);
        return restaurantMapper.fromEntityToDto(updated);

    }

    @Transactional
    public void deactive(Integer id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restoran tapılmadı: " + id));

        if (!restaurant.isHasAdvertisement()) {
            throw new IllegalStateException("Restoran artıq silinib/deaktiv edilib");
        }

        restaurant.setHasAdvertisement(false);
        restaurantRepository.save(restaurant);
    }

}
