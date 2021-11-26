package com.example.test09.controller;

import antlr.StringUtils;
import com.example.test09.dto.MemoAndCommentDto;
import com.example.test09.dto.MemoDto;
import com.example.test09.service.MemoService;
import com.example.test09.service.TagService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@RestController
public class MemoController {

    private final MemoService memoService;
    private final TagService tagService;

    @GetMapping("/articles")
    public List<MemoDto> memos(@RequestParam String searchTag) {
        if (!Objects.isNull(searchTag)) {
            return tagService.searchByTagName(searchTag);
        }
        return memoService.getAllMemo();
    }

    @GetMapping("/article")
    public MemoAndCommentDto getMemo(@RequestParam Long id) {
        return memoService.getMemo(id);
    }

    @PostMapping("/article")
    public ResponseEntity<String> postMemo(@RequestBody MemoDto memoDto) {
        memoService.addMemo(memoDto);
        return ResponseEntity.ok("ok");
    }

    @PutMapping("/article/{id}")
    public ResponseEntity<String> updateMemo(@PathVariable Long id, @RequestBody MemoDto memoDto) {
        memoService.updateMemo(id, memoDto);
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/article/tag")
    public ResponseEntity addTag(
            @RequestParam Long id,
            @RequestBody List<String> tagNames) {
        tagService.addTag(id, tagNames);

        return ResponseEntity.ok("ok");
    }
}
