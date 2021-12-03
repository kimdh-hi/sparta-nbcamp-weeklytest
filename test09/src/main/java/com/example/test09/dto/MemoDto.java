package com.example.test09.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MemoDto {

    private Long id;
    private String title;
    private String content;
    private Integer commentsCount;
    private LocalDateTime createdAt;

    private List<TagDto> tags = new ArrayList<>();
}
