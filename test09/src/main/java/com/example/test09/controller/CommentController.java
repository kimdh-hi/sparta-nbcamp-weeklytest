package com.example.test09.controller;

import com.example.test09.dto.CommentDto;
import com.example.test09.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/comment/{id}")
    public ResponseEntity addComment(
            @PathVariable Long id,
            @RequestBody CommentDto commentDto) {

        commentService.addComment(id, commentDto);
        return ResponseEntity.ok("ok");
    }
}
