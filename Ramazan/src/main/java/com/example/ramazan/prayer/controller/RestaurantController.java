package com.example.ramazan.prayer.controller;

import com.example.ramazan.model.IftarMenu;
import com.example.ramazan.model.Restaurant;
import com.example.ramazan.prayer.dto.RestaurantCreateDto;
import com.example.ramazan.prayer.dto.RestaurantDto;
import com.example.ramazan.prayer.service.RestaurantService;
import com.example.ramazan.repository.IftarMenuRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
@Controller
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final IftarMenuRepository iftarMenuRepository;

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

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload restaurant image (PNG/JPG)")
    public ResponseEntity<String> uploadImage(
            @Parameter(description = "Choose image file (PNG/JPG)")
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        String imageUrl = restaurantService.saveImage(file);
        return ResponseEntity.ok(imageUrl);
    }

    @GetMapping("/promted")
    public List<RestaurantDto> getMainPageRestaurants() {
        return  restaurantService.getMainPageRestaurants();
    }

    @PutMapping("/to-promoted/{id}")
    public RestaurantDto changeRestaurantToPromoted(@PathVariable Integer id) {
        return  restaurantService.changeRestaurantToPrompted(id);
    }

    @PutMapping("/deactive/{id}")
    public void deactive(@PathVariable Integer id) {
        restaurantService.deactive(id);
    }


}
