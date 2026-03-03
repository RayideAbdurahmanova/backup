package com.example.ramazan.prayer.controller;

import com.example.ramazan.model.IftarMenu;
import com.example.ramazan.model.Restaurant;
import com.example.ramazan.prayer.dto.RestaurantCreateDto;
import com.example.ramazan.prayer.dto.RestaurantDto;
import com.example.ramazan.prayer.service.RestaurantService;
import com.example.ramazan.repository.IftarMenuRepository;
import com.example.ramazan.repository.RestaurantRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
@Controller
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final IftarMenuRepository iftarMenuRepository;
    private final RestaurantRepository restaurantRepository;

    @GetMapping("/nearby")
    public List<RestaurantDto> nearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radiusKm
    ) {
        return restaurantService.nearBy(lat, lng, radiusKm);
    }

    @GetMapping("/{id}")
    public RestaurantDto getById(@PathVariable Integer id) {
        return restaurantService.getById(id);
    }

    @GetMapping("/{id}/menus")
    public List<IftarMenu> getMenus(@PathVariable Integer id) {
        return restaurantService.getMenus(id);
    }

    @PostMapping
    public ResponseEntity<Restaurant> create(
            @RequestBody RestaurantCreateDto dto
    ) {
        Restaurant savedRestaurant = restaurantService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRestaurant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantDto> update(
            @PathVariable Integer id,
            @RequestBody RestaurantCreateDto dto
    ) {
        RestaurantDto updated = restaurantService.update(id, dto);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        restaurantService.delete(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping(
            value = "/{id}/cover",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Transactional
    public ResponseEntity<String> uploadCoverImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        return restaurantService.uploadCoverImage(id, file);
    }


    @GetMapping(value = "/{id}/cover")
    public ResponseEntity<byte[]> getCoverImage(@PathVariable Integer id) {
        return restaurantService.getCoverImage(id);
    }

    @GetMapping("/promted")
    public List<RestaurantDto> getMainPageRestaurants() {
        return restaurantService.getMainPageRestaurants();
    }

    @PutMapping("/to-promoted/{id}")
    public RestaurantDto changeRestaurantToPromoted(@PathVariable Integer id) {
        return restaurantService.changeRestaurantToPrompted(id);
    }

    @PutMapping("/deactive/{id}")
    public void deactive(@PathVariable Integer id) {
        restaurantService.deactive(id);
    }


}
