package com.example.test09.controller;

import com.example.test09.dto.MemoAndCommentDto;
import com.example.test09.dto.MemoDto;
import com.example.test09.service.MemoService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class MemoController {

    private final MemoService memoService;

    @GetMapping("/memos")
    public List<MemoDto> memos() {
        return memoService.getAllMemo();
    }

    @GetMapping("/memo")
    public MemoAndCommentDto getMemo(@RequestParam Long id) {
        return memoService.getMemo(id);
    }

    @PostMapping("/memo")
    public ResponseEntity<String> postMemo(@RequestBody MemoDto memoDto) {
        memoService.addMemo(memoDto);
        return ResponseEntity.ok("ok");
    }

    @PutMapping("/memo/{id}")
    public ResponseEntity<String> updateMemo(@PathVariable Long id, @RequestBody MemoDto memoDto) {
        memoService.updateMemo(id, memoDto);
        return ResponseEntity.ok("ok");
    }
}
