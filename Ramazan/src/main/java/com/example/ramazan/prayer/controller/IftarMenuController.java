package com.example.ramazan.prayer.controller;


import com.example.ramazan.model.IftarMenu;
import com.example.ramazan.model.Restaurant;
import com.example.ramazan.prayer.dto.IftarMenuCreateDto;
import com.example.ramazan.prayer.dto.IftarMenuResponseDto;
import com.example.ramazan.prayer.service.IftarMenuService;
import com.example.ramazan.repository.IftarMenuRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/v1/iftar-menu")
@RequiredArgsConstructor
@Controller
public class IftarMenuController {

    private final IftarMenuService iftarMenuService;
    private final IftarMenuRepository iftarMenuRepository;

    @PostMapping()
    public IftarMenuResponseDto create(@Valid @RequestBody IftarMenuCreateDto iftarMenuCreateDto) {
        return iftarMenuService.create(iftarMenuCreateDto);
    }

    @PutMapping("/{id}")
    public IftarMenuResponseDto update(@PathVariable Integer id,
                                       @Valid @RequestBody IftarMenuCreateDto iftarMenuCreateDto) {

        return iftarMenuService.update(id, iftarMenuCreateDto);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        iftarMenuService.delete(id);
    }


    @PostMapping(
            value = "/{id}/cover",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Transactional
    public ResponseEntity<String> uploadCoverImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        return iftarMenuService.uploadCoverImage(id, file);

    }


    @GetMapping(value = "/{id}/cover")
    public ResponseEntity<byte[]> getCoverImage(@PathVariable Integer id) {
        return iftarMenuService.getCoverImage(id);
    }

}
