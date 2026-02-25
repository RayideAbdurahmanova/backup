package com.example.ramazan.repository;

import com.example.ramazan.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant,Integer> {

    @Query("SELECT r FROM Restaurant r WHERE r.hasAdvertisement = true ORDER BY r.createdAt DESC")
    List<Restaurant> findByHasAdvertisementTrue();
}
