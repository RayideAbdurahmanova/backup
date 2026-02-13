package com.example.ramazan.prayer.service;

import com.example.ramazan.exception.InvalidIftarMenuException;
import com.example.ramazan.model.IftarMenu;
import com.example.ramazan.model.Restaurant;
import com.example.ramazan.prayer.dto.IftarMenuCreateDto;
import com.example.ramazan.prayer.dto.IftarMenuResponseDto;
import com.example.ramazan.prayer.mapper.IftarMenuMapper;
import com.example.ramazan.prayer.notification.NotificationService;
import com.example.ramazan.repository.IftarMenuRepository;
import com.example.ramazan.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class IftarMenuService {

    private final IftarMenuRepository iftarMenuRepository;
    private final IftarMenuMapper iftarMenuMapper;
    private final RestaurantRepository restaurantRepository;
    private final NotificationService notificationService;

    public IftarMenuResponseDto create(IftarMenuCreateDto dto){

        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));


        if (dto.getPrice() == null || dto.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidIftarMenuException("Price must be greater than 0");
        }

        IftarMenu entity = iftarMenuMapper.toEntity(dto, restaurant);

        IftarMenu saved = iftarMenuRepository.save(entity);

        notificationService.sendToAll(
                "Yeni Iftar Menu 🍽️",
                saved.getTitle() + " əlavə olundu"
        );

        return iftarMenuMapper.toDto(saved);
    }

    public IftarMenuResponseDto update(Integer id,IftarMenuCreateDto dto){

        IftarMenu menu = iftarMenuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("IftarMenu not found"));

        if (!menu.getRestaurantId().getId().equals(dto.getRestaurantId())) {
            Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found"));
            menu.setRestaurantId(restaurant);
        }


        menu.setTitle(dto.getTitle());
        menu.setDescription(dto.getDescription());
        if (dto.getPrice() == null || dto.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidIftarMenuException("Price must be greater than 0");
        }
        menu.setPrice(dto.getPrice());
        menu.setImageUrlsJson(dto.getImageUrlsJson());
        menu.setIsActive(dto.getIsActive());

        IftarMenu saved = iftarMenuRepository.save(menu);

        return iftarMenuMapper.toDto(saved);

    }


    public void delete(Integer id) {

        IftarMenu menu = iftarMenuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("IftarMenu not found"));
        iftarMenuRepository.deleteById(id);

    }
}
