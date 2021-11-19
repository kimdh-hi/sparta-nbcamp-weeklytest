package com.example.test09.service;

import com.example.test09.domain.Memo;
import com.example.test09.dto.MemoAndCommentDto;
import com.example.test09.dto.MemoDto;
import com.example.test09.repository.MemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MemoService {

    private final MemoRepository memoRepository;

    @Transactional
    public void addMemo(MemoDto dto) {

        Memo memo = new Memo(dto.getTitle(), dto.getContent());

        memoRepository.save(memo);
    }

    @Transactional(readOnly = true)
    public List<MemoDto> getAllMemo() {
        List<Memo> memos = memoRepository.findAll();
        return memos.stream()
                .map(m -> new MemoDto(m.getId(), m.getTitle(), m.getContent(), m.getCommentsCount(), m.getCreatedAt())).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MemoAndCommentDto getMemo(Long id) {
        Memo memo = memoRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("찾을 수 없는 메모입니다.")
        );

        MemoAndCommentDto dto = new MemoAndCommentDto();
        if (memo.getComments().size() > 0) {
            dto.setComments(memo.getComments().stream().map(c -> new String(c.getContent())).collect(Collectors.toList()));
        }
        dto.setTitle(memo.getTitle());
        dto.setContent(memo.getContent());

        return dto;
    }

    @Transactional
    public void updateMemo(Long id, MemoDto dto) {
        Memo memo = memoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("찾을 수 없는 메모입니다."));

        memo.updateMemo(dto);
    }
}
