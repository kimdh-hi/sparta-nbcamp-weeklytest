package com.example.test09.service;

import com.example.test09.domain.Memo;
import com.example.test09.domain.Tag;
import com.example.test09.dto.MemoDto;
import com.example.test09.dto.TagDto;
import com.example.test09.repository.MemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TagService {

    private final MemoRepository memoRepository;

    @Transactional
    public void addTag(Long memoId, List<String> tagName) {
        Memo memo = memoRepository.findById(memoId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 메모입니다.")
        );

        for (String s : tagName) {
            memo.addTag(new Tag(s));
        }
    }

    @Transactional
    public List<MemoDto> searchByTagName(String tagName) {
        List<Memo> memos = memoRepository.findByTagName(tagName);

        return memos.stream().map(
                m -> new MemoDto(
                        m.getId(),
                        m.getTitle(),
                        m.getContent(),
                        m.getCommentsCount(),
                        m.getCreatedAt(),
                        m.getTags().stream().map(
                                t -> new TagDto(t.getTagName())
                        ).collect(Collectors.toList())
                )
        ).collect(Collectors.toList());
    }
}
