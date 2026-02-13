package com.example.ramazan.repository;

import com.example.ramazan.model.IftarMenu;
import com.example.ramazan.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IftarMenuRepository extends JpaRepository<IftarMenu, Integer> {

    List<IftarMenu> findByRestaurantId(Restaurant restaurantId);
}
