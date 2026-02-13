package com.example.ramazan.prayer.service;

import com.example.ramazan.common.util.TimeUtil;
import com.example.ramazan.model.DailyContent;
import com.example.ramazan.prayer.dto.DailyContentCreateDto;
import com.example.ramazan.prayer.mapper.DailyContentMapper;
import com.example.ramazan.repository.DailyContentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class DailyContentService {

    private final DailyContentRepository dailyContentRepository;
    private final DailyContentMapper dailyContentMapper;

   public  DailyContent getToday() {
        LocalDate today = TimeUtil.now().toLocalDate();
        return getByDate(today);
    }

    public DailyContent getByDate(LocalDate date) {
        return dailyContentRepository.findByDate(date)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No daily content found for date: " + date
                ));
    }

    public DailyContent create(DailyContentCreateDto dailyContentCreateDto){
        DailyContent newContent=dailyContentMapper.toEntity(dailyContentCreateDto);
        DailyContent saved = dailyContentRepository.save(newContent);
        return  saved;
    }

    public void delete(Long id) {
        dailyContentRepository.deleteById(id);
    }

    public DailyContent update(Long id, DailyContentCreateDto dailyContentCreateDto) {
        DailyContent content = dailyContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DailyContent not found"));
        dailyContentMapper.updateEntity(dailyContentCreateDto, content);
        return dailyContentRepository.save(content);
    }

}
