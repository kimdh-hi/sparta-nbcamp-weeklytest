package com.sparta.test08.controller;

import com.sparta.test08.domain.Memo;
import com.sparta.test08.dto.PostDto;
import com.sparta.test08.repository.MemoRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@RestController
public class MemoController {

    private final MemoRepository memoRepository;

    @PostMapping("/memo")
    public String saveMemo(@RequestBody PostDto dto)  {
        memoRepository.save(new Memo(dto.getContents()));

        return "작성완료";
    }

    @GetMapping("/memo")
    public List<String> getMemo() {
        return memoRepository.findAll().stream()
                .map(m -> new String(m.getContents()))
                .collect(Collectors.toList());
    }
}
