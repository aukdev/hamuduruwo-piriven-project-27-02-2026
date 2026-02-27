package com.piriven.mcq.paper.controller;

import com.piriven.mcq.paper.dto.PaperDto;
import com.piriven.mcq.paper.service.PaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/papers")
@RequiredArgsConstructor
public class PaperController {

    private final PaperService paperService;

    @GetMapping("/years")
    public ResponseEntity<List<Integer>> getAvailableYears() {
        return ResponseEntity.ok(paperService.getAvailableYears());
    }

    @GetMapping
    public ResponseEntity<List<PaperDto>> getPapersByYear(@RequestParam int year) {
        return ResponseEntity.ok(paperService.getPapersByYear(year));
    }
}
