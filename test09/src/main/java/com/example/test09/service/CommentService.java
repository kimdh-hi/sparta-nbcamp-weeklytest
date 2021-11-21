package com.example.test09.service;

import com.example.test09.domain.Comment;
import com.example.test09.domain.Memo;
import com.example.test09.dto.CommentDto;
import com.example.test09.repository.CommentRepository;
import com.example.test09.repository.MemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final MemoRepository memoRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public void addComment(Long id, CommentDto commentDto) {
        Memo memo = memoRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 메모입니다.")
        );

        Comment comment = new Comment(commentDto.getContent());
        commentRepository.save(comment);

        memo.addComment(comment);
    }
}
