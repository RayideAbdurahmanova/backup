package com.example.ramazan.prayer.controller;


import com.example.ramazan.prayer.dto.IftarMenuCreateDto;
import com.example.ramazan.prayer.dto.IftarMenuResponseDto;
import com.example.ramazan.prayer.service.IftarMenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/iftar-menu")
@RequiredArgsConstructor
@Controller
public class IftarMenuController {

    private final IftarMenuService iftarMenuService;

    @PostMapping()
    public IftarMenuResponseDto create ( @Valid @RequestBody IftarMenuCreateDto iftarMenuCreateDto){
        return iftarMenuService.create(iftarMenuCreateDto);
    }

    @PutMapping("/{id}")
    public  IftarMenuResponseDto update(@PathVariable Integer id,
                                       @Valid @RequestBody IftarMenuCreateDto iftarMenuCreateDto){
        return iftarMenuService.update(id,iftarMenuCreateDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){
         iftarMenuService.delete(id);
    }
}
