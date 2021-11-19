package com.example.test09.service;

import com.example.test09.domain.Comment;
import com.example.test09.dto.CommentDto;
import com.example.test09.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public void addComment(CommentDto commentDto) {
        commentRepository.save(new Comment(commentDto.getContent()));
    }
}
