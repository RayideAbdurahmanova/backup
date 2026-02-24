package com.example.ramazan.repository;

import com.example.ramazan.model.IftarMenu;
import com.example.ramazan.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IftarMenuRepository extends JpaRepository<IftarMenu, Integer> {

    List<IftarMenu> findByRestaurantId(Restaurant restaurantId);
}
