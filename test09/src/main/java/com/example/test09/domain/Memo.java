package com.example.test09.domain;

import com.example.test09.dto.MemoDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Memo extends Timestamped{

    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;
    @Column(nullable = true)
    private String  content;
    private Integer commentsCount;

    @OneToMany(mappedBy = "memo", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "memo", cascade = CascadeType.ALL)
    private List<Tag> tags = new ArrayList<>();

    public void addTag(Tag... tag) {
        for (Tag t : tag) {
            this.getTags().add(t);
            t.setMemo(this);
        }
    }

    public void addComment(Comment comment) {
        ++this.commentsCount;
        this.getComments().add(comment);
        comment.setMemo(this);
    }

    public void updateMemo(MemoDto memoDto) {
        this.title = memoDto.getTitle();;
        this.content = memoDto.getContent();
    }

    public Memo(String title, String content) {
        this.title = title;
        this.content = content;
        this.commentsCount = 0;
    }
}
