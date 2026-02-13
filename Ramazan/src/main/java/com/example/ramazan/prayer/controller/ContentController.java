package com.example.ramazan.prayer.controller;

import com.example.ramazan.model.DailyContent;
import com.example.ramazan.prayer.dto.DailyContentCreateDto;
import com.example.ramazan.prayer.service.DailyContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class ContentController {
    private final DailyContentService dailyContentService;

    @GetMapping("/today")
    ResponseEntity<DailyContent> getToday(){
        DailyContent content = dailyContentService.getToday();
        return ResponseEntity.ok(content);
    }

    @GetMapping()
    ResponseEntity<DailyContent>  getByDate(@RequestParam  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
        DailyContent content = dailyContentService.getByDate(date);
        return ResponseEntity.ok(content);    }

    @PostMapping
    public ResponseEntity<DailyContent> create(
            @RequestBody DailyContentCreateDto dto
    ) {
        DailyContent created = dailyContentService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }


    @PutMapping("/{id}")
    public ResponseEntity<DailyContent> update(
            @PathVariable Long id,
            @RequestBody DailyContentCreateDto dto
    ) {
        DailyContent updated = dailyContentService.update(id, dto);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dailyContentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
