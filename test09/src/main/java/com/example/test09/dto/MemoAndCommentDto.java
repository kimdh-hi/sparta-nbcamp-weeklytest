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
public class MemoAndCommentDto {

    private String title;
    private String content;
    private List<String> comments = new ArrayList<>();
}
