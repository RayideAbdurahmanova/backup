package com.example.ramazan.repository;

import com.example.ramazan.model.DailyContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyContentRepository  extends JpaRepository<DailyContent, Long> {
Optional<DailyContent>  findByDate(LocalDate date);
}
