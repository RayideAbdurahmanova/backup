package com.example.ramazan.repository;

import com.example.ramazan.model.IftarMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IftarMenuRepository extends JpaRepository<IftarMenu, Integer> {


    @Query("SELECT m FROM IftarMenu m WHERE m.restaurant.id = :restaurantId")
    List<IftarMenu> findByRestaurant_Id(Integer restaurantId);
}
